import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import {connectApp} from "./connect-app-compat";

export const connectStorage = ({
                                   apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
                                   projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                                   authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
                                   storageBucket = process.env.NEXT_PUBLIC_STORAGE_BUCKET_URL,
                                   emulatorHost = process.env.NEXT_PUBLIC_STORAGE_EMULATOR_HOST,
                               } = {}) => {
    connectApp({apiKey, projectId, storageBucket, authDomain});
    const firestore = firebase.storage();
    if (!!emulatorHost) {
        const url = new URL(`http://${emulatorHost}`);
        firestore.useEmulator(url.hostname, parseInt(url.port));
    }
    return firestore;
};
