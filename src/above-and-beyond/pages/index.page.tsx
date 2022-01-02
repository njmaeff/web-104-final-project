import React, {useEffect} from "react"
import type {NextPage} from "next";
import {LoaderCircle} from "./lib/feedback/loaderCircle";
import {checkAuthUI} from "./lib/hooks/checkAuthUI";
import {useRouter} from "./routes";


export const HomePage: NextPage = () => {
    const router = useRouter()
    const {isLoggedIn} = checkAuthUI()

    useEffect(() => {
        const checkAuth = async () => {
            if (isLoggedIn === false) {
                await router.login.push();
            } else if (isLoggedIn === true) {
                await router.home.push()
            }
        };
        checkAuth();
    }, [isLoggedIn]);

    return <LoaderCircle/>
}

export default HomePage
