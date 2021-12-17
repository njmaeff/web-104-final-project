import {MenuTemplate} from "../lib/menuTemplate";
import React from 'react';
import {Rate} from "../lib/orm/validate";
import {SearchInterface} from "../lib/instantSearch";

export const RateList = () => {

    return (
        <SearchInterface/>
    );
};

export default () => {

    return <MenuTemplate
        heading={'Rate'}
    >
        <RateList/>
    </MenuTemplate>
};
