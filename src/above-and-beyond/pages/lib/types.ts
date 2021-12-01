import React from "react";
import {NextPage} from "next";

export type QueryProps<Query = {}> = {
    query?: Query
};
export type Page<PageProps = {}, Query = {}> = React.FC<PageProps & QueryProps<Query>>;


export type NextPageWithLayout = NextPage & {
    getLayout?: React.FC
}
