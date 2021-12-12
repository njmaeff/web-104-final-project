import React from "react";
import {NextPage} from "next";


export type NextPageWithLayout = NextPage & {
    getLayout?: React.FC
}
