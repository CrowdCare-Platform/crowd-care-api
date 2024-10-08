const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const tenantData = {
    data: [
        {
            id: 1,
            name: "Het Vlaamse Kruis",
            description: " ",
            logo: "https://crowdcare.be/hvk.jpg",
            url: "hvk",
        },],
};

const eventsData = {
    data: [
        {
            id: 1,
            name: "Pukkelpop 2024",
            startDate: new Date("2024-08-15"),
            endDate: new Date("2024-08-18"),
            tenantId: 1,
            description:
                "Het event met de beste medische gegevensregistratie ter wereld",
            logo: "https://crowdcare.be/pkp2024.jpg",
        },
    ],
};

const aidPostData = {
    data: [
        {
            id: 1,
            name: "Hulppost Main",
            eventId: 1,
            sleepCapacity: 12,
            T1Capacity: 2,
            T2Capacity: 2,
            T3Capacity: 15,
            waitingRoomCapacity: 20,
        },
        {
            id: 2,
            name: "Hulppost Dance",
            eventId: 1,
            sleepCapacity: 12,
            T1Capacity: 2,
            T2Capacity: 2,
            T3Capacity: 15,
            waitingRoomCapacity: 20,
        },
        {
            id: 3,
            name: "Hulppost Chill",
            eventId: 1,
            sleepCapacity: 12,
            T1Capacity: 2,
            T2Capacity: 2,
            T3Capacity: 15,
            waitingRoomCapacity: 20,
        },
        {
            id: 4,
            name: "Hulppost Relax",
            eventId: 1,
            sleepCapacity: 12,
            T1Capacity: 2,
            T2Capacity: 2,
            T3Capacity: 9,
            waitingRoomCapacity: 15,
        }
    ],
};

const ambulanceData = {
    data: [
        {
            id: 1,
            name: "ZW PKP1 (Main)",
            comment: "",
            order: 0,
            eventId: 1,
        },
        {
            id: 2,
            name: "ZW PKP2 (Dance)",
            comment: "",
            order: 1,
            eventId: 1,
        },
        {
            id: 3,
            name: "ZW PKP3 (Chill)",
            comment: "",
            order: 2,
            eventId: 1,
        },
        {
            id: 4,
            name: "ZW PKP4 (Relax)",
            comment: "",
            order: 3,
            eventId: 1,
        },
    ],
};

const hospitalData = {
    data: [
        {
            id: 1,
            name: "Jessa Ziekenhuis (Hasselt)",
            comment: "",
            order: 0,
            eventId: 1,
        },
        {
            id: 2,
            name: "SFZ Heusden-Zolder",
            comment: "",
            order: 1,
            eventId: 1,
        },
        {
            id: 3,
            name: "ZOL Genk",
            comment: "",
            order: 2,
            eventId: 1,
        },
        {
            id: 4,
            name: "Sint-Trudo Ziekenhuis (Sint-Truiden)",
            comment: "",
            order: 3,
            eventId: 1,
        },
        {
            id: 5,
            name: "UZ Leuven",
            comment: "",
            order: 4,
            eventId: 1,
        },
        {
            id: 6,
            name: "UMC+ Maastricht",
            comment: "",
            order: 5,
            eventId: 1,
        },
        {
            id: 7,
            name: "RWTH Aachen",
            comment: "",
            order: 6,
            eventId: 1,
        },
        {
            id: 8,
            name: "CHU Tilman (Luik)",
            comment: "",
            order: 7,
            eventId: 1,
        },
        {
            id: 9,
            name: "ZNA Stuivenberg (Antwerpen)",
            comment: "",
            order: 8,
            eventId: 1,
        },
        {
            id: 10,
            name: "GH Charleroi",
            comment: "",
            order: 9,
            eventId: 1,
        },
        {
            id: 11,
            name: "UZ Gent",
            comment: "",
            order: 10,
            eventId: 1,
        },
    ],
};

const load = async () => {
    try {
        // Cleanup
        console.log("Cleaning up database...");
        await prisma.parameterSet.deleteMany();
        await prisma.medicationStorage.deleteMany();
        await prisma.patientEncounterLocationLog.deleteMany();
        await prisma.patientEncounter.deleteMany();
        await prisma.aidPost.deleteMany();
        await prisma.hospital.deleteMany();
        await prisma.ambulance.deleteMany();
        await prisma.feedback.deleteMany();
        await prisma.event.deleteMany();
        await prisma.tenant.deleteMany();

        // Resetting sequences
        console.log("Resetting sequences...");
        await prisma.$executeRaw`ALTER SEQUENCE "PatientEncounter_id_seq" RESTART WITH 1`;
        await prisma.$executeRaw`ALTER SEQUENCE "AidPost_id_seq" RESTART WITH 1`;
        await prisma.$executeRaw`ALTER SEQUENCE "Hospital_id_seq" RESTART WITH 1`;
        await prisma.$executeRaw`ALTER SEQUENCE "Ambulance_id_seq" RESTART WITH 1`;
        await prisma.$executeRaw`ALTER SEQUENCE "Event_id_seq" RESTART WITH 1`;
        await prisma.$executeRaw`ALTER SEQUENCE "Tenant_id_seq" RESTART WITH 1`;
        await prisma.$executeRaw`ALTER SEQUENCE "Feedback_id_seq" RESTART WITH 1`;
        await prisma.$executeRaw`ALTER SEQUENCE "MedicationStorage_id_seq" RESTART WITH 1`;
        await prisma.$executeRaw`ALTER SEQUENCE "ParameterSet_id_seq" RESTART WITH 1`;
        await prisma.$executeRaw`ALTER SEQUENCE "PatientEncounterLocationLog_id_seq" RESTART WITH 1`;


        // Creating new entries
        console.log("Creating new entries...");
        await prisma.tenant.createMany(tenantData);
        console.log("Tenants created!");
        await prisma.event.createMany(eventsData);
        console.log("Events created!");
        await prisma.aidPost.createMany(aidPostData);
        console.log("Aidposts created!");
        await prisma.ambulance.createMany(ambulanceData);
        console.log("Ambulances created!");
        await prisma.hospital.createMany(hospitalData);
        console.log("Hospitals created!");
    } catch (e) {
        console.error(e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
};
load();
