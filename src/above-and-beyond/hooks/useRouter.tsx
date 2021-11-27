import React, { useContext, useState } from "react";
import { Page } from "../components/types";

interface RouterContext<T = any> {
    navigate: (opts: { to: string }) => void;
    Component: Page<T>;
}

export type ContextState = {
    Component: React.FC<any>;
};

const RouterContext = React.createContext<Partial<RouterContext>>({});

interface RouterProviderOpts {
    routes: [string | RegExp, React.FC<any>][];
}

export const RouterProvider: React.FC<RouterProviderOpts> = ({
    children,
    routes,
}) => {
    const routeMap = new Map(routes);
    const DefaultComponent = routeMap.get("/");
    const [{ Component }, updateComponent] = useState<ContextState>({
        Component: DefaultComponent,
    });

    const navigate = (opts: { to: string; params? }) => {
        // use last component if the url doesn't match
        let nextComponent = Component;
        for (const [key, value] of routeMap.entries()) {
            if (
                key === opts.to ||
                (key instanceof RegExp && key.test(opts.to))
            ) {
                nextComponent = value;
                break;
            }
        }

        updateComponent({
            Component: nextComponent,
        });
    };

    return (
        <RouterContext.Provider value={{ navigate, Component }}>
            {children}
        </RouterContext.Provider>
    );
};

export function useRouter<T = any>() {
    return useContext<Partial<RouterContext<T>>>(RouterContext);
}
