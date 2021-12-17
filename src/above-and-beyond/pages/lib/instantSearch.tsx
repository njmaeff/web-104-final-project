import {
    Configure,
    connectHits,
    InstantSearch,
    SearchBox,
    Stats,
} from "react-instantsearch-dom"
import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter"
import {auth} from "./firebase/connect-api";
import {useAsync} from "./hooks/useAsync";
import {Loader} from "./loader";
import {List} from "antd";
import VirtualList from "rc-virtual-list";
import {Rate} from "./orm/validate";
import {ExclamationCircleOutlined, LikeOutlined} from "@ant-design/icons";
import Link from "next/link";
import {routes} from "../routes";
import React from "react";
import {Timestamp} from "./orm/docs";
import {useRole} from "../employer/useRole";


export const useSearchClient = () => {
    return useAsync(async () => {
        const token = await auth.currentUser.getIdTokenResult()
        const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
            server: {
                apiKey: token.claims?.searchKey,
                nodes: [
                    {
                        host: process.env.NEXT_PUBLIC_SEARCH_HOST,
                        port: process.env.NEXT_PUBLIC_SEARCH_PORT,
                        protocol: process.env.NEXT_PUBLIC_SEARCH_PROTOCOL as any
                    },
                ],
            },
            collectionSpecificSearchParameters: {
                rate: {
                    queryBy: "result",
                },
                review: {
                    queryBy: "outcome",
                },
            },
            additionalSearchParameters: {
                numTypos: 3,
            },
        })
        return typesenseInstantsearchAdapter.searchClient

    }, []);
};

export const AllHits = connectHits(({hits}) => {

    return <List>
        <VirtualList
            data={hits}
            itemHeight={47}
            itemKey="email"
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
                            })}><a>{new Timestamp(item.date, 0).toDate().toLocaleString()}</a>
                            </Link>
                        }
                        description={item.result}
                    />
                </List.Item>
            )}
        </VirtualList>
    </List>
});

export const SearchInterface = () => {
    const client = useSearchClient();
    const role = useRole()
    return client.isSuccess ? (
        <InstantSearch searchClient={client.result} indexName="rate">
            <Configure facetFilters={[`roleID:${role.currentRoleID}`]}/>
            <SearchBox/>
            <Stats/>
            <AllHits/>
        </InstantSearch>
    ) : <Loader/>
}
