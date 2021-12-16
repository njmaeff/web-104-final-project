import {MenuTemplate} from "../lib/menuTemplate";
import React, {useEffect, useState} from 'react';
import {List} from 'antd';
import VirtualList from 'rc-virtual-list';
import {Rate} from "../lib/orm/validate";
import {ExclamationCircleOutlined, LikeOutlined} from "@ant-design/icons";
import Link from "next/link";
import {routes} from "../routes";

const fakeDataUrl =
    'https://randomuser.me/api/?results=20&inc=name,gender,email,nat,picture&noinfo';
const ContainerHeight = 400;

export const RateList = () => {

    const [data, setData] = useState([]);

    const appendData = () => {
        fetch(fakeDataUrl)
            .then(res => res.json())
            .then(body => {
                setData(data.concat(body.results));
            });
    };

    useEffect(() => {
        appendData();
    }, []);

    const onScroll = e => {
        if (e.target.scrollHeight - e.target.scrollTop === ContainerHeight) {
            appendData();
        }
    };

    return (
        <>

            <List>
                <VirtualList
                    data={data}
                    itemHeight={47}
                    itemKey="email"
                    onScroll={onScroll}
                >
                    {(item: Rate) => (
                        <List.Item
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
                                    })}><a>{item.date}</a>
                                    </Link>
                                }
                                description={item.result}
                            />
                        </List.Item>
                    )}
                </VirtualList>
            </List></>
    );
};

export default () => {

    return <MenuTemplate
        heading={'Rate'}
    >
        <RateList/>
    </MenuTemplate>
};
