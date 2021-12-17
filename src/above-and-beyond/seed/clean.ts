import {getFirestore} from "firebase-admin/firestore";
import {testEmail} from "./setup";
import {
    connectFirebaseAdminAuth,
    removeUserByEmail
} from "../pages/lib/firebase/connect-admin";
import {createClient} from "./search";

export async function clearFirestoreData(
    subCollections?: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>[]
) {
    const db = getFirestore();
    const collections = subCollections ?? (await db.listCollections());
    for (const coll of collections) {
        // Get a new write batch
        const batch = db.batch();
        const documents = await coll.listDocuments();

        for (const doc of documents) {
            await clearFirestoreData(await doc.listCollections());
            batch.delete(doc);
        }
        await batch.commit();
    }
    return;
}

export const cleanFunctions = async () => {
    const client = createClient({})

    const collections = await client.collections().retrieve()

    return Promise.all(
        collections.map((collection) => client.collections(collection.name).delete())
    )
};

export const clean = async () => {
    await cleanFunctions()
    connectFirebaseAdminAuth();
    await clearFirestoreData();
    await removeUserByEmail(testEmail);
};


if (require.main) {
    clean().catch((e) => console.error(e));
}
