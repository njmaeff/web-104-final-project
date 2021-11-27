import {
    collection,
    CollectionReference,
    deleteDoc,
    doc,
    DocumentData,
    DocumentSnapshot,
    Firestore,
    getDoc,
    getDocs,
    QuerySnapshot,
    setDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

export class FirestoreProvider<Doc extends DocumentData> {
    write(document: Doc) {
        return setDoc(
            doc(this.db, this.collection.path, this.id ?? document.id),
            document
        );
    }

    read(id = this.id) {
        return getDoc(doc(this.db, this.collection.path, id)) as Promise<
            DocumentSnapshot<Doc>
        >;
    }

    deleteDoc(id = this.id) {
        return deleteDoc(doc(this.db, this.collection.path, id));
    }

    readFromCollection(): Promise<QuerySnapshot<Doc>> {
        return getDocs(this.collection) as Promise<QuerySnapshot<Doc>>;
    }

    constructor(
        private paths = [],
        private db: Firestore,
        private id?: string
    ) {}

    get collection(): CollectionReference<Doc> {
        return collection(
            this.db,
            `${getAuth().currentUser?.uid}`,
            ...this.paths
        ) as CollectionReference<Doc>;
    }
}
