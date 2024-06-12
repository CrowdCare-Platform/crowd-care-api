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
                const timeStartTreatment = faker.date.between({
                    from: addMinutes(timeIn, 0),
                    to: addMinutes(timeIn, 20),
                });
                const timeOut = faker.date.between({
                    from: addMinutes(timeStartTreatment, 5),
                    to: addMinutes(timeStartTreatment, 120),
                });

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
                            "WHITE",
                        ]),
                        chiefComplaint: faker.helpers.arrayElement([
                            "ADEMHALING",
                            "HYPERVENTILATIE",
                            "ALLERGIE",
                            "LOKALE_REACTIE",
                            "ANAFYLAXIE",
                            "BEWEGINGSSTELSEL",
                            "VERSTUIKING",
                            "RADIOGRAFIE",
                            "BRANDWONDE",
                            "BEWUSTZIJNSVERLIES",
                            "FLAUWTE_SYNCOPE",
                            "EPILEPSIE",
                            "EIGEN_MEDICATIE",
                            "HARTKLACHTEN",
                            "HOOFDPIJN",
                            "HUIDWONDE",
                            "HECHTING",
                            "INSECTENBEET",
                            "ONTSTEKING",
                            "INTOXICATIE",
                            "ALCOHOL",
                            "DRUGS",
                            "KEELPIJN",
                            "MAAG_DARM",
                            "OOGLETSEL",
                            "TANDPIJN",
                            "ANDERE",
                            "PLEISTER",
                            "MAANDVERBAND",
                            "ZONNECREME_AFTERSUN",
                        ]),
                        timeStartTreatment,
                        timeOut,
                        methodOut: faker.helpers.arrayElement([
                            "BACK_TO_FESTIVAL",
                            "OTHER_STATION",
                            "HOME",
                        ]),
                        userId: faker.string.uuid(),
                        aidPostId: faker.helpers.arrayElement([
                            1, 2, 3
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
