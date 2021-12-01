import React from "react";

export const routeComponent = <T extends React.FC, Props extends Parameters<T>[0]>(component: T, props = {} as Props): {
    Component: T,
    props: Props
} => {
    return {
        Component: component,
        props
    }
};
