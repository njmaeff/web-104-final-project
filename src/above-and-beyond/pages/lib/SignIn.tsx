import {useEffect} from "react";
import {auth} from "./firebase/connect-api";
import * as firebaseui from "firebaseui"
import firebase from "firebase/compat/app";
import {router} from "next/client";
import styled from "@emotion/styled";
import {darken} from "polished";


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
                            router.push('/home/index', '/home/')
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
    margin-top: 3rem;
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
    }

`

export function SignInScreen() {
    useFirebaseUI();

    return <div id={"firebaseui-auth-container"}/>
}


export default SignInScreen
