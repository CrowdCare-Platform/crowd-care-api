const { addMinutes } = require("date-fns");
const { faker } = require("@faker-js/faker");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const load = async () => {
    try {
            console.log("Creating patientEncounters...");
            // create patientEncounters for each event
            for (let j = 0; j < faker.number.int({ min: 143, max: 298 }); j++) {
                console.log("Creating patientEncounter " + j);
                const timeIn = faker.date.between({
                    from: "2024-08-15T00:00:00.000Z",
                    to: "2024-08-18T00:00:00.000Z",
                });
                const timeTriage = faker.date.between({
                    from: addMinutes(timeIn, 2),
                    to: addMinutes(timeIn, 10),
                });
                const timeStartTreatment = faker.date.between({
                    from: addMinutes(timeTriage, 0),
                    to: addMinutes(timeTriage, 20),
                });
                const timeOut = faker.date.between({
                    from: addMinutes(timeStartTreatment, 5),
                    to: addMinutes(timeStartTreatment, 120),
                });

                const methodOut = faker.helpers.arrayElement([
                    "BACK_TO_FESTIVAL",
                    "HOME",
                    "TO_HOSPITAL_DGH"
                ])

                await prisma.patientEncounter.create({
                    data: {
                        qrCode: "" + j,
                        rfid: faker.string.uuid(),
                        timeIn,
                        methodIn: faker.helpers.arrayElement([
                            "SELF",
                            "WITH_SUPPORT",
                        ]),
                        gender: faker.helpers.arrayElement(["MALE", "FEMALE", "OTHER"]),
                        age: faker.number.int({min: 18, max: 60}),
                        patientType: faker.helpers.arrayElement([
                            "VISITOR",
                            "CREW",
                            "EXTERNAL",
                        ]),
                        triage: faker.helpers.arrayElement([
                            "RED",
                            "YELLOW",
                            "GREEN",
                        ]),
                        timeTriage,
                        chiefComplaint: faker.helpers.arrayElement([
                            "HUIDWONDE",
                            "BRANDWONDE",
                            "INSECTENBEET",
                            "HECHTING",
                            "ALLERGIE",
                            "ZONNEALLERGIE",
                            "PIJN",
                            "HOODPIJN",
                            "SPIERPIJN",
                            "MENSTRUATIEPIJN",
                            "HYPERVENTILATIE",
                            "HARTKLACHTEN",
                            "MAAG_DARM",
                            "BOVENSTE_LUCHTWEGEN",
                            "FLAUWTE",
                            "INTOXICATIE",
                            "BEWEGINGSSTELSEL",
                            "BEELDVORMING",
                            "OOG",
                            "ANDERE",
                        ]),
                        timeStartTreatment,
                        timeOut,
                        methodOut,
                        hospitalOutId: methodOut === "TO_HOSPITAL_DGH" ? faker.helpers.arrayElement([1,2,3]) : null,
                        userId: faker.string.uuid(),
                        aidPostId: faker.helpers.arrayElement([
                            1, 2, 3, 4
                        ]),
                    },
                });
            }
        // Creating active registrations
        for (let j = 0; j < faker.number.int({ min: 11, max: 43 }); j++) {
            console.log("Creating active patientEncounter " + j);
            const timeIn = faker.date.between({
                from: "2024-08-15T00:00:00.000Z",
                to: "2024-08-18T00:00:00.000Z",
            });
            const timeTriage = faker.date.between({
                from: addMinutes(timeIn, 2),
                to: addMinutes(timeIn, 10),
            });
            const timeStartTreatment = faker.date.between({
                from: addMinutes(timeTriage, 0),
                to: addMinutes(timeTriage, 20),
            });

            await prisma.patientEncounter.create({
                data: {
                    qrCode: "active_" + j,
                    rfid: faker.string.uuid(),
                    timeIn,
                    methodIn: faker.helpers.arrayElement([
                        "SELF",
                        "WITH_SUPPORT",
                    ]),
                    gender: faker.helpers.arrayElement(["MALE", "FEMALE", "OTHER"]),
                    age: faker.number.int({min: 18, max: 60}),
                    patientType: faker.helpers.arrayElement([
                        "VISITOR",
                        "CREW",
                        "EXTERNAL",
                    ]),
                    triage: faker.helpers.arrayElement([
                        "RED",
                        "YELLOW",
                        "GREEN",
                    ]),
                    timeTriage,
                    chiefComplaint: faker.helpers.arrayElement([
                        "HUIDWONDE",
                        "BRANDWONDE",
                        "INSECTENBEET",
                        "HECHTING",
                        "ALLERGIE",
                        "ZONNEALLERGIE",
                        "PIJN",
                        "HOODPIJN",
                        "SPIERPIJN",
                        "MENSTRUATIEPIJN",
                        "HYPERVENTILATIE",
                        "HARTKLACHTEN",
                        "MAAG_DARM",
                        "BOVENSTE_LUCHTWEGEN",
                        "FLAUWTE",
                        "INTOXICATIE",
                        "BEWEGINGSSTELSEL",
                        "BEELDVORMING",
                        "OOG",
                        "ANDERE",
                    ]),
                    timeStartTreatment,
                    userId: faker.string.uuid(),
                    aidPostId: faker.helpers.arrayElement([
                        1, 2, 3, 4
                    ]),
                },
            });
        }
    } catch (e) {
        console.error(e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
};
load();
