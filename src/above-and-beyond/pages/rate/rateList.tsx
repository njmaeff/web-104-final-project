import {MenuTemplate} from "../lib/menuTemplate";
import React from 'react';
import {Rate} from "../lib/orm/validate";
import {SearchInterface} from "../lib/instantSearch";
import {List} from "antd";
import {ExclamationCircleOutlined, LikeOutlined} from "@ant-design/icons";
import Link from "next/link";
import {routes} from "../routes";
import {Timestamp} from "../lib/orm/docs";
import {Highlight} from "react-instantsearch-dom";
import {css} from "@emotion/react";

export const RateListHits: React.FC<{ hits }> = ({hits}) => {
    return hits.map((item) => {
        return <List.Item
            key={item.id}
        >
            <List.Item.Meta
                avatar={
                    item.type === 'success' ? <LikeOutlined/> :
                        <ExclamationCircleOutlined/>
                }
                title={
                    <Link href={routes.rate({
                        query: {
                            id: item.id
                        }
                    })}><a>{new Timestamp(item.date, 0).toDate().toLocaleString()}</a>
                    </Link>
                }
                description={
                    <Highlight css={theme => css`
                        .ais-Highlight-highlighted {
                            background-color: ${theme.colors.grayLight};
                        }
                    `} attribute="result" hit={item}/>
                }
            />
        </List.Item>

    })
};

export const RateList = () => {

    return (
        <SearchInterface indexName={'rate'} HitsComponent={RateListHits}/>
    );
};

export default () => {

    return <MenuTemplate
        heading={'Rate'}
    >
        <RateList/>
    </MenuTemplate>
};
