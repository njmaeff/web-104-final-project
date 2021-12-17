import {
    Configure,
    connectInfiniteHits,
    connectPoweredBy,
    connectSearchBox,
    InstantSearch,
} from "react-instantsearch-dom"
import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter"
import {auth} from "./firebase/connect-api";
import {useAsync} from "./hooks/useAsync";
import {Loader} from "./loader";
import {Input} from "antd";
import React from "react";
import {useRole} from "../employer/useRole";
import {InfiniteHits} from "./search/infiniteHits";
import {css} from "@emotion/react";

const {Search} = Input

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

const PoweredBy = connectPoweredBy(({url}) => <a css={css`
    font-size: 0.8rem;
`} href={'https://typesense.org/'}>Powered by
    Typesense</a>
);

const SearchBox = connectSearchBox(({
                                        currentRefinement,
                                        isSearchStalled,
                                        refine,
                                        children
                                    }) => (
    <form css={css`
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        max-width: 24rem;
    `} noValidate action="" role="search">
        <Search
            type="search"
            value={currentRefinement}
            allowClear
            onChange={event => refine(event.currentTarget.value)}
        />
        {children}
        {isSearchStalled ? 'My search is stalled' : ''}
    </form>
));

const Hits = connectInfiniteHits(InfiniteHits)

export const SearchInterface = () => {
    const client = useSearchClient();
    const role = useRole()
    return client.isSuccess ? (
        <InstantSearch searchClient={client.result} indexName="rate">
            <Configure
                hitsPerPage={10}
                // facetFilters={[`roleID:${role.currentRoleID}`]}
            />
            <SearchBox>
                <PoweredBy/>
            </SearchBox>

            <Hits/>
        </InstantSearch>
    ) : <Loader/>
}
