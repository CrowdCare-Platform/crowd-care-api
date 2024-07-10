const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const tenantData = {
    data: [
        {
            id: 1,
            name: "Het Vlaamse Kruis",
            description: "De grootste hulpverleningsorganisatie van Vlaanderen",
            logo: "",
            url: "hvk",
        }],
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
        },
    ],
};

const aidPostData = {
    data: [
        {
            id: 1,
            name: "Hulppost 1",
            eventId: 1
        },
        {
            id: 2,
            name: "Hulppost 2",
            eventId: 1
        },
        {
            id: 3,
            name: "Hulppost 3",
            eventId: 1
        },
    ],
};

const ambulanceData = {
    data: [
        {
            id: 1,
            name: "DGH Pukkelpop 1",
            comment: "",
            order: 0,
            eventId: 1,
        },
        {
            id: 2,
            name: "DGH Pukkelpop 2",
            comment: "",
            order: 1,
            eventId: 1,
        },
        {
            id: 3,
            name: "DGH Pukkelpop 3",
            comment: "",
            order: 2,
            eventId: 1,
        },
        {
            id: 4,
            name: "DGH Pukkelpop 4",
            comment: "",
            order: 3,
            eventId: 1,
        },
        {
            id: 5,
            name: "NDP Pukkelpop 1",
            comment: "",
            order: 4,
            eventId: 1,
        },
        {
            id: 6,
            name: "NDP Pukkelpop 2",
            comment: "",
            order: 5,
            eventId: 1,
        },
        {
            id: 7,
            name: "NDP Pukkelpop 3",
            comment: "",
            order: 6,
            eventId: 1,
        },
        {
            id: 8,
            name: "NDP Pukkelpop 4",
            comment: "",
            order: 7,
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
        // cleanup
        console.log("Cleaning up database...");
        await prisma.parameterSet.deleteMany();
        await prisma.patientEncounter.deleteMany();
        await prisma.aidPost.deleteMany();
        await prisma.hospital.deleteMany();
        await prisma.ambulance.deleteMany();
        await prisma.event.deleteMany();
        await prisma.tenant.deleteMany();

        // creating new entries
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
