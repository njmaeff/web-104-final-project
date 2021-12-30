import {auth, db} from "../firebase/connect-api";
import firebase from "firebase/compat/app";
import {useState} from "react";
import {FirestoreProvider} from "../firebase/firestore-provider-compat";
import {useAsync} from "../hooks/useAsync";
import {DateLike, Doc, Employer, Rate, Review, Role} from "./validate";
import {useEmployer} from "../../home/useEmployer";
import {useRole} from "../../home/useRole";

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
        useAsync<Doc>(() => this.read(id) as any, []);

    useDeleteDoc = () =>
        makeAsyncCallbackHook((id = this.id?.()) => this.deleteDoc(id));

    useReadFromCollection = (init = []) =>
        useAsync(() => this.readFromCollection(), [], {initialState: init});

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

    toPath() {
        return this.id ? [this.collection.path, this.id()].join('/') : this.collection.path
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

export class RoleHook {

    constructor() {
        const {currentEmployerID} = useEmployer()
        const {currentRoleID} = useRole();

        this.roleApi = getEmployer().withID(currentEmployerID).fromSubCollection<Role>('roles').withID(currentRoleID);
    }

    get rate() {
        return this.roleApi.fromSubCollection<Rate>('rate')
    }

    get review() {
        return this.roleApi.fromSubCollection<Review>('review')
    }

    private roleApi: Firestore<Role>;
}

export const Timestamp = firebase.firestore.Timestamp;
export const isTimestampLike = (obj): obj is { _seconds: number, _nanoseconds: number } => '_seconds' in obj && '_nanoseconds' in obj
export const ensureDate = (date: DateLike): Date => {
    if (date instanceof Timestamp) {
        return date.toDate();
    } else if (isTimestampLike(date)) {
        return new Timestamp(date._seconds, date._nanoseconds).toDate()
    } else {
        return date;
    }
};

export const isDateLike = (date: DateLike) => {
    return date instanceof Timestamp || date instanceof Date;
};
