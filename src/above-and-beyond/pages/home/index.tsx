import React from "react";
import {MainPage} from "./mainPage";
import {useRouter} from "next/router";
import {routeComponent} from "./routeComponent";


const routes = new Map([
    ["index", routeComponent(MainPage)],
    ["new", routeComponent(MainPage, {newEmployer: true})],
])

export const useRoutes = (routes) => {
    const router = useRouter()
    const {page, ...query} = router.query;
    const {
        Component,
        props
    } = routes.get(page as string) ?? routes.get('index')

    return {Component, props, query} as const
};

const withRoutes = (routes) => {
    const {Component, props, query} = useRoutes(routes)

    return <Component {...props} query={query}/>
};

const Page = () => withRoutes(routes);

export default Page
