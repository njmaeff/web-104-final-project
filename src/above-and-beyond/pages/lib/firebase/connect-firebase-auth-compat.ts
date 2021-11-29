import firebase from "firebase/compat/app";
import "firebase/compat/auth";

export const connectAuth = ({
    apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    emulatorHost = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST,
} = {}) => {
    if (!firebase.apps.length) {
        firebase.initializeApp({
            apiKey,
            authDomain,
            projectId,
        });
    }

    const auth = firebase.auth();
    if (!!emulatorHost) {
        auth.useEmulator(`http://${emulatorHost}`);
    }
    return auth;
};
