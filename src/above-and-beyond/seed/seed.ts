import {
    addUserByEmail,
    connectFirebaseAdmin,
} from "../firebase/connect-admin";
import {
    CollectionReference,
    DocumentReference,
    getFirestore,
} from "firebase-admin/firestore";
import faker from "faker";
import { DataMeta, Employer, Role } from "../orm/docs";
import { testEmail, testPassword } from "./setup";
import range from "lodash/range";

faker.seed(19);

const seed = async () => {
    connectFirebaseAdmin();
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
                    location: faker.name.jobArea(),
                } as Employer)
        );

        const userPath = userCollection.doc(user.uid);
        const employerPath = userPath.collection("employers");

        const employerDocs = await createDocsFromData(employerPath, employers);

        await mapEachDoc(employerDocs, (doc) => {
            const roles = range(2).map(() => {
                const salary = faker.finance.amount(50000, 80000);
                return {
                    name: faker.name.jobTitle(),
                    salary: salary,
                    salaryTarget: (parseInt(salary) + 5000).toString(),
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

        const currentEmployerRef = employerDocs[0];
        const currentRolesSnapshot = await currentEmployerRef
            .collection("roles")
            .get();

        // create profile
        const currentEmployer = await currentEmployerRef.get();
        const currentRole = currentRolesSnapshot.docs[0];
        await userPath.create({
            currentEmployerID: currentEmployer.id,
            currentRoleID: currentRole.id,
        } as DataMeta);
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
    fn: (docRef: DocumentReference) => Promise<DocumentReference[]>
) => {
    return (await Promise.all(docs.map((doc) => fn(doc))))[0];
};
