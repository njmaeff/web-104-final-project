import {auth, db} from "../firebase/connect-api";
import firebase from "firebase/compat/app";
import {useState} from "react";
import {FirestoreProvider} from "../firebase/firestore-provider-compat";
import {useAsync} from "../hooks/useAsync";
import {DateLike, Doc, Employer, Rate, Review, Role} from "./validate";

/**
 * Helper function to compose paths to documents stored in collections.
 * @param paths
 */
export const makeUserPath = (...paths): string[] => ["users", ...paths];

export const makeAsyncCallbackHook = <FN extends (...args: any[]) => Promise<any>>(
    fn: FN
) => {
    const [state, update] = useState<Awaited<FN>>();

    const hook = (...args: Parameters<FN>): ReturnType<FN> =>
        fn(...args).then((result) => {
            update(result);
            return result;
        }) as ReturnType<FN>;

    return [state, hook] as const;
};

/**
 * Base class for building react hooks using firebase and wrapping the firebase
 * api for upgrading the sdk in the future
 */
export class Firestore<Doc extends firebase.firestore.DocumentData> extends FirestoreProvider<Doc, Doc["type"]> {
    useWrite = () =>
        makeAsyncCallbackHook(async (document: Doc) => this.write(document));

    useRead = (id = this.id?.()) =>
        useAsync(() => this.read(id), {
            deps: [],
        });

    useDeleteDoc = () =>
        makeAsyncCallbackHook((id = this.id?.()) => this.deleteDoc(id));

    useReadFromCollection = (init = []) =>
        useAsync(() => this.readFromCollection(), {init, deps: []});

    fromSubCollection<Doc extends firebase.firestore.DocumentData>(
        name: string,
        id = this.id?.()
    ) {
        return new Firestore<Doc>(this.db, () => [...this.paths(), id, name]);
    }

    withID(id: string) {
        return new Firestore<Doc>(
            this.db,
            () => this.paths(),
            () => id
        );
    }
}

export interface DataMeta extends Doc {
    currentEmployerID: string;
    currentRoleID: string;
}

export type FirebaseDoc = Employer | Role | Rate | Review;

export class UserProvider extends Firestore<DataMeta> {
    constructor() {
        super(
            db,
            () => makeUserPath(),
            () => auth.currentUser.uid
        );
    }
}

export const user = new UserProvider();
export const getEmployer = () => user.fromSubCollection<Employer>("employers");

export class EmployerCollection {
    static fromID(id: string) {
        return new EmployerCollection(id);
    }

    constructor(private id: string) {
    }

    get roles() {
        return this.employer.withID(this.id).fromSubCollection<Role>("roles");
    }

    get review() {
        return this.employer
            .withID(this.id)
            .fromSubCollection<Review>("review");
    }

    get rate() {
        return this.employer.withID(this.id).fromSubCollection<Rate>("rate");
    }

    private employer = getEmployer();
}

export const Timestamp = firebase.firestore.Timestamp;
export const ensureDate = (date: DateLike): Date => {
    if (date instanceof Timestamp) {
        return date.toDate();
    } else {
        return date;
    }
};

export const isDateLike = (date: DateLike) => {
    return date instanceof Timestamp || date instanceof Date;
};
