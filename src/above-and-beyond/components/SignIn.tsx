import {useEffect} from "react";
import {auth} from "../api/connect-api";
import * as firebaseui from "firebaseui"
import firebase from "firebase/compat/app";
import {router} from "next/client";


export const useFirebaseUI = () => {

    useEffect(() => {
        let ui = firebaseui.auth.AuthUI.getInstance();
        if (!ui) {
            ui = new firebaseui.auth.AuthUI(auth)
        }
        if (!ui.isPendingRedirect()) {

            ui.start("#firebaseui-auth-container", {
                callbacks: {
                    signInSuccessWithAuthResult(authResult): boolean {
                        if (
                            authResult.additionalUserInfo.isNewUser
                        ) {
                            router.push('/getting-started');
                        } else if (authResult.user) {
                            router.push('/app')
                        }

                        return false;
                    },
                },
                signInOptions: [
                    // Leave the lines as is for the providers you want to
                    // offer your users.
                    firebase.auth.EmailAuthProvider.PROVIDER_ID,
                ],
                signInFlow: "popup",
            })
        }

    }, [])

}

export function SignInScreen() {
    useFirebaseUI();

    return <div id={"firebaseui-auth-container"}/>
}


export default SignInScreen
