import {UrlObject} from "url";
import {useRouter as useNextRouter} from "next/router"

export const makeAbsolutePath = (...paths) => `/` + paths.filter((p) => !!p).join(`/`)

export interface Routes {
    employer: {
        query: {
            action: 'new'
        }
    }
    profile
    rate
    'rate/new': {
        query: {
            type: "success" | "issue"
        }
    }
    'rate/view': {
        query: {
            id: string
        }
    }
    'review/new'
    'review/view': {
        query: {
            id: string
        }
    }
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


export type RouteOptions<Routes> = {
    [P in keyof Routes]: (opts?: UrlObject) => UrlObject
}

export type UseRouterPush<Routes> = {
    [P in keyof Routes]: (opts?: UrlObject) => Promise<void>
}

export const routes: RouteOptions<Routes> = {
    employer: makeRouteUrlObject('employer'),
    profile: makeRouteUrlObject('profile'),
    'rate/new': makeRouteUrlObject('rate/new'),
    'rate/view': makeRouteUrlObject('rate/view'),
    rate: makeRouteUrlObject('rate'),
    'review/new': makeRouteUrlObject('review/new'),
    'review/view': makeRouteUrlObject('review/view'),
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

        routeMap[key] = {
            push: (opts) => router.push(fn(opts)),
            query: () => router.query,
        }
    }
    return routeMap as {
        [P in keyof Routes]: {
            push: (opts?: UrlObject) => Promise<void>,
            query: () => Routes[P]['query']
        }
    }
};
