import {connectAuth} from "../pages/lib/firebase/connect-firebase-auth-compat";

const auth = connectAuth();
auth.onAuthStateChanged(async (user) => {
        if (!user) {
            await auth.signInWithEmailAndPassword(
                process.env.FIREBASE_TEST_USER,
                process.env.FIREBASE_TEST_PASSWORD
            );
        }
    },
    (error) => {
        console.error(error);
    }
)

