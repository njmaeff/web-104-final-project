import React, {useEffect} from "react"
import type {NextPage} from "next";
import {useRouter} from "next/router";
import {Loader} from "../lib/js/components/loader";
import {auth} from "../lib/api/connect-api";


export const HomePage: NextPage = () => {
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const user = await auth.currentUser;
            if (!user) {
                await router.push('/login');
            } else {
                await router.push('/app')
            }
        };
        checkAuth();
    }, []);

    return <Loader/>
}

export default HomePage
