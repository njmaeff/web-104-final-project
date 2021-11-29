import React from "react"
import {NextPageWithLayout} from "../../components/types";
import {AppLayout} from "../../components/layout/appLayout";
import {WithoutSSR} from "../../util/next";

export const MainPage: NextPageWithLayout = () => {
    return <WithoutSSR component={() => import('../../components/main')}/>
}

MainPage.getLayout = AppLayout

export default MainPage



