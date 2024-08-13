import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { fromBuffer } from 'pdf2pic';
import { PNG } from 'pngjs';
import jsQR from 'jsqr';
import { PDFDocument } from 'pdf-lib';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { MethodOut } from '@prisma/client';
import * as fs from 'node:fs';
import * as path from 'node:path';

const pdf2picOptions = {
  quality: 100,
  density: 300,
  format: 'png',
  width: 2000,
  height: 2000,
};

@Injectable()
export class UploadService {
  constructor(private readonly prismaService: PrismaService) {}
  private s3 = new S3Client({
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    },
  });
  async uploadFiles(tenantId: number, eventId: number, file: any) {
    // 1. Read QR-code on page
    const base64Response = await fromBuffer(file.buffer, pdf2picOptions)(1, {
      responseType: 'base64',
    });
    const dataUri = base64Response?.base64;
    const buffer = Buffer.from(dataUri, 'base64');
    const png = PNG.sync.read(buffer);
    const code = jsQR(Uint8ClampedArray.from(png.data), png.width, png.height);
    const qrCodeText = code?.data;

    if (!qrCodeText) {
      throw new BadRequestException(
        'Er werd geen QR-code gevonden op de eerste pagina van het document.',
      );
    }

    // 2. Check if qrCode exists in database
    const encounter = await this.prismaService.patientEncounter.findFirst({
      where: {
        qrCode: qrCodeText,
      },
    });

    if (!encounter) {
        throw new BadRequestException(`Er werd geen registratie gevonden waar fiche ${qrCodeText} aan gekoppeld is.`);
    }

    // 3. Obfuscate identification data with a black rectangle
    const pdfDoc = await PDFDocument.load(file.buffer);
    const img = await pdfDoc.embedPng(
      fs.readFileSync(path.resolve(__dirname, '../public/logo_box.png')),
    );
    const firstPage = pdfDoc.getPages()[0];
    firstPage.drawImage(img, {
      x: 0,
      y: 570,
      width: firstPage.getWidth(),
      height: 90,
    });
    const pdfBytes = await pdfDoc.save();
    const pdfBuffer = Buffer.from(pdfBytes);


    // 4. Save file to S3
    const fileExtension = file.originalname.split('.').pop();
    const key = `verzorgingsfiche-${tenantId}-${eventId}-${new Date().getTime()}.${fileExtension}`;
    const temp = await this.s3.send(new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_PATIENT_ENCOUNTER_FORMS || "",
        Key: key,
        Body: pdfBuffer,
        ContentType: file.mimetype,
    }));

    if (temp.$metadata.httpStatusCode !== 200) {
        throw new Error('Er is een fout opgetreden bij het uploaden van het bestand naar de server.');
    }


    // 5. Add file to the encounter and also register "timeOut" if it is NULL
    const attachments = encounter.attachments ? encounter.attachments : [];
    attachments.push(key);
    if (!encounter.timeOut) {
        await this.prismaService.patientEncounter.update({
            where: {
                id: encounter.id
            },
            data: {
                attachments,
                timeOut: new Date(),
                methodOut: MethodOut.LEFT_FORGOT
            }
        });
    } else {
        await this.prismaService.patientEncounter.update({
            where: {
                id: encounter.id
            },
            data: {
                attachments
            }
        });
    }

    return {
      message: encounter!.id,
      ok: true,
    };
  }
}
