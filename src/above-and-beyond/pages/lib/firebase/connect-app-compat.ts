import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

export const connectApp = ({
                               apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
                               projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                               authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
                               storageBucket = process.env.NEXT_PUBLIC_STORAGE_BUCKET_URL,
                           } = {}) => {
    if (!firebase.apps.length) {
        return firebase.initializeApp({
            apiKey,
            authDomain,
            projectId,
            storageBucket,
        });
    } else {
        return firebase.app()
    }
};

