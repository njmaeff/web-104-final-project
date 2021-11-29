import React from "react";
import {router} from "next/client";

const routes = new Map([
    ["list", () => <div>List</div>],
    ["view", () => <div>View</div>],
    ["create", () => <div>Create</div>],
    // ["main", MainPage],
    // ["profile", ProfilePage],
    // ["analyze", EditPage],
    // ["review", ReviewPage],
    // ["rate-success", RateSuccessPage],
    // ["rate-issue", RateIssuePage],
])


const Main = () => {
    const {page, ...params} = router.query;
    const Component: React.FC<{ params?: any }> = routes.get(page as string)
    return <Component params={params}/>;
};

export default Main
