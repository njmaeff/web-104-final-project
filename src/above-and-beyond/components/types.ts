import React from "react";
import {NextPage} from "next";

export type PageProps<Params = {}> = {
    params?: Params
};
export type Page<Params = {}> = React.FC<PageProps<Params>>;


export type NextPageWithLayout = NextPage & {
    getLayout?: React.FC
}
