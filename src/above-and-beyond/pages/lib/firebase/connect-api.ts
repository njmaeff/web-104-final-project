import {connectAuth} from "./connect-firebase-auth-compat";
import {connectFirestore} from "./connect-firestore-compat";
import {connectStorage} from "./connect-storage-compat";

export const auth = connectAuth();
export const db = connectFirestore();
export const storage = connectStorage();
