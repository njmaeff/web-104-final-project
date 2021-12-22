import firebase from "firebase/compat/app";
import "firebase/compat/storage";

export const connectStorage = ({
                                   apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
                                   projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                                   authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
                                   emulatorHost = process.env.NEXT_PUBLIC_STORAGE_EMULATOR_HOST,
                               } = {}) => {
    if (!firebase.apps.length) {
        firebase.initializeApp({
            apiKey,
            authDomain,
            projectId,
        });
    }

    const firestore = firebase.storage();
    if (!!emulatorHost) {
        const url = new URL(`http://${emulatorHost}`);
        firestore.useEmulator(url.hostname, parseInt(url.port));
    }
    return firestore;
};
