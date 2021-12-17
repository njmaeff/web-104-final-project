import {SearchInterface} from "../lib/instantSearch";
import {MenuTemplate} from "../lib/menuTemplate";
import React from "react";
import {List} from "antd";
import {StarOutlined} from "@ant-design/icons";
import Link from "next/link";
import {routes} from "../routes";
import {Timestamp} from "../lib/orm/docs";
import {Highlight} from "react-instantsearch-dom";
import {css} from "@emotion/react";

export const ReviewListHits: React.FC<{ hits }> = ({hits}) => {
    return hits.map((item) => {
        return <List.Item
            key={item.id}
        >
            <List.Item.Meta
                avatar={
                    <StarOutlined/>
                }
                title={
                    <Link href={routes.review({
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
                    `} attribute="outcome" hit={item}/>
                }
            />
        </List.Item>

    })
};


export const ReviewList = () => {

    return (
        <SearchInterface indexName={'review'} HitsComponent={ReviewListHits}/>
    );
};

export default () => {

    return <MenuTemplate
        heading={'Review'}
    >
        <ReviewList/>
    </MenuTemplate>
};
