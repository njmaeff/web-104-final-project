import {UrlObject} from "url";
import {useRouter as useNextRouter} from "next/router"

export const makeAbsolutePath = (...paths) => `/` + paths.filter((p) => !!p).join(`/`)

export interface Routes {
    home
    profile
    rate
    review
    report
    index
    login
    gettingStarted
}

export const makeRouteUrlObject = (name: keyof Routes) => ({
                                                               pathname,
                                                               ...opts
                                                           }: UrlObject = {}) => {
    return ({pathname: makeAbsolutePath(name, pathname), ...opts} as UrlObject)
}


export type RouteOptions = {
    [P in keyof Routes]: (opts: UrlObject) => UrlObject
}

export type UseRouter = {
    [P in keyof Routes]: (opts: UrlObject) => void
}

export const routes: RouteOptions = {
    home: makeRouteUrlObject('home'),
    profile: makeRouteUrlObject('profile'),
    rate: makeRouteUrlObject('rate'),
    review: makeRouteUrlObject('review'),
    report: makeRouteUrlObject('report'),
    index: makeRouteUrlObject('index'),
    login: makeRouteUrlObject('login'),
    gettingStarted: makeRouteUrlObject('gettingStarted'),
}

export const actions = {
    view: 'view',
    edit: 'edit',
    new: 'new'
}


export const useRouter = () => {
    const router = useNextRouter();

    const routeMap = {};
    for (const [key, fn] of Object.entries(routes)) {

        routeMap[key] = (opts) => router.push(fn(opts))
    }
    return routeMap as UseRouter
};
