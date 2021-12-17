import React, {useEffect, useRef} from 'react';
import {Highlight} from 'react-instantsearch-dom';
import {List} from "antd";
import {ExclamationCircleOutlined, LikeOutlined} from "@ant-design/icons";
import Link from "next/link";
import {routes} from "../../routes";
import {Timestamp} from "../orm/docs";
import {css} from "@emotion/react";

export const InfiniteHits = ({hasMore, refineNext, hits}) => {

    const sentinel = useRef(null);
    const onSentinelIntersection = entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && hasMore) {
                refineNext();
            }
        });
    };

    useEffect(() => {
        const observer = new IntersectionObserver(onSentinelIntersection);
        observer.observe(sentinel.current);
        return () => observer.disconnect()
    })

    return (
        <List>
            {hits.map((item, index) => {
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
                            <Highlight css={css`
                                .ais-Highlight-highlighted {
                                    background-color: aqua;
                                }
                            `} attribute="result" hit={item}/>
                        }
                    />

                    {index}
                </List.Item>

            })}
            <li
                className="ais-InfiniteHits-sentinel"
                ref={sentinel}
            />
        </List>
    );
}
