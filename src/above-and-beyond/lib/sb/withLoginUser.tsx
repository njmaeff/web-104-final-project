import { usePromise } from "./usePromise";
import React from "react";
import { auth } from "../api/connect-api";

export const WithLoginUser = (Story) => {
    const loaded = usePromise(async () => {
        if (!auth.currentUser) {
            await auth.signInWithEmailAndPassword(
                process.env.FIREBASE_TEST_USER,
                process.env.FIREBASE_TEST_PASSWORD
            );
        }
    });

    return loaded ? <Story /> : <div />;
};
