import React, {useEffect} from "react";
import {auth} from "./lib/firebase/connect-api";
import * as firebaseui from "firebaseui"
import firebase from "firebase/compat/app";
import styled from "@emotion/styled";
import {darken} from "polished";
import {useRouter} from "./routes";


export const useFirebaseUI = () => {
    const router = useRouter();

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
                            router.gettingStarted.push();
                        } else if (authResult.user) {
                            router.home.push()
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

export const FirebaseAuthContainer = styled.div`
    margin-top: 10rem;
    font-family: 'Rubik', sans-serif;

    button {
        background-color: ${({theme}) => theme.colors.primary} !important;
        color: ${({theme}) => theme.colors.light} !important;
        opacity: 85%;

        span {
            color: ${({theme}) => theme.colors.light} !important;
        }

        &:hover, &:active {
            background-color: ${({theme}) => darken('15%', theme.colors.primary)
            } !important;
        }
    }

    div {
        h1 {
            font-size: 2rem;
            color: ${({theme}) => theme.colors.dark};
            margin-bottom: 1rem;
        }

        input {
            border-bottom: thin solid ${({theme}) => theme.colors.dark};
        }

        background-color: transparent;

        .firebaseui-card-header {
            border-bottom: none !important;
        }
    }

`

export function SignInScreen() {
    useFirebaseUI();

    return <div id={"firebaseui-auth-container"}/>
}


export const LoginPage = () => {

    return <FirebaseAuthContainer>
        <main><SignInScreen/></main>
    </FirebaseAuthContainer>
};


export default LoginPage
