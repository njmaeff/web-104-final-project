import {
    addUserByEmail,
    connectFirebaseAdminAuth,
} from "../pages/lib/firebase/connect-admin";
import {
    CollectionReference,
    DocumentReference,
    getFirestore,
} from "firebase-admin/firestore";
import faker from "faker";
import {testEmail, testPassword} from "./setup";
import range from "lodash/range";
import {
    Employer,
    Rate,
    RateIssue,
    RateSuccess,
    Review,
    Role
} from "../pages/lib/orm/validate";
import {flatten} from "lodash";
import {makeCollections} from "./seed-search";

faker.seed(19);

const seed = async () => {
    try {

        await makeCollections();
    } catch (e) {
        console.error(e)
    }

    connectFirebaseAdminAuth();
    try {
        const user = await addUserByEmail(testEmail, testPassword, {
            displayName: "Nik Jmaeff",
        });
        const db = getFirestore();
        const userCollection = db.collection(`users`);

        // create employers
        const employers = range(3).map(
            () =>
                ({
                    name: faker.company.companyName(),
                    location: faker.address.streetAddress(true),
                } as Employer)
        );

        const userPath = userCollection.doc(user.uid);
        const employerPath = userPath.collection("employers");

        const employerDocs = await createDocsFromData(employerPath, employers);

        const roles = await mapEachDoc(employerDocs, (doc) => {
            const roles = range(2).map(() => {
                const salary = parseInt(faker.finance.amount(50000, 80000));
                return {
                    name: faker.name.jobTitle(),
                    salary: salary,
                    salaryTarget: salary + 5000,
                    skillTarget: faker.lorem.lines(5),
                    startDate: faker.date.past(1),
                    responsibilities: [
                        faker.lorem.lines(3),
                        faker.lorem.lines(2),
                    ].join("\n\n"),
                } as Role;
            });

            return createDocsFromData(doc.collection("roles"), roles);
        });

        await mapEachDoc(roles, async (doc) => {
            const ratings = range(5).map((index) => {

                const props = {
                    date: faker.date.past(1),
                    value: parseInt(faker.finance.amount(100, 200)),
                    situation: faker.lorem.lines(3),
                    result: faker.lorem.lines(2)
                } as Rate

                if (index % 2 === 0) {
                    return {
                        ...props,
                        correction: faker.lorem.lines(3),
                        type: "issue",
                    } as RateIssue;
                } else {
                    return {
                        ...props,
                        type: "success"
                    } as RateSuccess;
                }

            });
            const reviews = range(4).map(() => {

                return {
                    date: faker.date.past(1),
                    adjustedSalary: parseInt(faker.finance.amount(500, 3000)),
                    manager: faker.name.firstName(),
                    outcome: faker.lorem.lines(3)
                } as Review
            });

            await createDocsFromData(doc.collection('rate'), ratings)
            await createDocsFromData(doc.collection('review'), reviews)
        });

    } catch (e) {
        console.error(e);
    }
};

if (require.main) {
    seed().catch((e) => console.error(e));
}

export const createDocsFromData = <T extends any[]>(
    collection: CollectionReference,
    docs: T
): Promise<DocumentReference[]> => {
    return Promise.all(
        docs.map(async (doc) => {
            const docRef = collection.doc();
            await docRef.create(doc);
            return docRef;
        })
    );
};

export const mapEachDoc = async (
    docs: DocumentReference[],
    fn: (docRef: DocumentReference) => Promise<DocumentReference[]> | Promise<void>
): Promise<DocumentReference[]> => {
    return flatten(
        await Promise.all(
            docs.map((doc) => fn(doc))
        ) as any
    );
};
