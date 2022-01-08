import {usePromise} from "./usePromise";
import React from "react";
import {auth} from "../firebase/connect-api";
import {LoaderCircle} from "../feedback/loaderCircle";
import {WithEnvironment} from "../hooks/withEnvironment";
import {useRole} from "../../home/useRole";
import {useEmployer} from "../../home/useEmployer";

export const WithLoginUser = (Story) => {
    const loaded = usePromise(async () => {
        if (!auth.currentUser) {
            await auth.signInWithEmailAndPassword(
                process.env.FIREBASE_TEST_USER,
                process.env.FIREBASE_TEST_PASSWORD
            );
        }
    });

    return loaded ? WithEnvironment(() => {

        const employer = useEmployer().useCurrent()
        const role = useRole().useCurrent()


        return employer.isInProgress || role.isInProgress ? <LoaderCircle/> :
            <Story/>
    }) : <LoaderCircle/>;
};
