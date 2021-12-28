import {
    Configure,
    connectInfiniteHits,
    connectPoweredBy,
    connectSearchBox,
    connectStateResults,
    InstantSearch,
    RefinementList,
    SortBy,
    SortByProps,
} from "react-instantsearch-dom"
import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter"
import {auth} from "./firebase/connect-api";
import {AsyncHook} from "./hooks/useAsync";
import {Loader} from "./loader";
import {Input} from "antd";
import React from "react";
import {InfiniteHits} from "./search/infiniteHits";
import {css} from "@emotion/react";
import capitalize from "lodash/capitalize";
import {ScrollBar} from "./styles/mixins";
import {fetchCustomToken} from "./util/fetchCustomToken";
import {StateResultsProvided} from "react-instantsearch-core";

const {Search} = Input

export const useSearchClient = () => {
    return new AsyncHook(
        async () => {
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

        }, []
    )
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
    <form css={theme => css`
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        max-width: 24rem;
        margin: 0.5rem 0;

        color: ${theme.colors.dark};

        .ant-input-wrapper {
            span, input, button {
                background-color: ${theme.colors.light};
            }
        }

    `} noValidate action="" role="search">
        <Search
            type="search"
            placeholder={'Search'}
            value={currentRefinement}
            allowClear
            onChange={event => refine(event.currentTarget.value)}
        />
        {children}
        {isSearchStalled ? 'My search is stalled' : ''}
    </form>
));

const Hits = connectInfiniteHits(InfiniteHits) as React.ComponentClass<{ HitsComponent }, any>

const CustomErrorCatcher: React.FC<StateResultsProvided & { onError, error?: { httpStatus?: number } }> = ({
                                                                                                               error,
                                                                                                               onError
                                                                                                           }) => {
    if (error?.httpStatus === 401) {
        onError();
    }
    return null
}
const ErrorCatcher = connectStateResults(CustomErrorCatcher) as React.ComponentClass<{ onError }, any>;

export const SearchInterface: React.FC<{
    indexName: string
    HitsComponent
    sortByProps?: SortByProps
    refinementProps?: { attribute: string }
    filters?: string[]
}> = ({
          indexName,
          filters,
          sortByProps,
          refinementProps,
          HitsComponent
      }) => {
    const client = useSearchClient();
    return client.isSuccess ? (
        <InstantSearch searchClient={client.result} indexName={indexName}>
            <Configure
                hitsPerPage={10}
                facetFilters={filters}
            />
            <div css={css`
                display: flex;
                flex-direction: column;
                height: 100%;
            `}>
                <div css={
                    theme => css`
                        background-color: ${theme.colors.light} !important;
                    `
                }>
                    <SearchBox>
                        <PoweredBy/>
                    </SearchBox>
                    <div css={css`
                        display: flex;
                    `}>
                        {sortByProps && <SortBy
                            {...sortByProps}

                        />}
                        {refinementProps && <RefinementList
                            transformItems={(items) => {
                                return items.map(item => ({
                                    ...item,
                                    label: capitalize(item.label)
                                }))
                            }
                            }
                            {...refinementProps}
                        />}
                    </div>
                </div>
                <div css={theme => css`
                    ${ScrollBar(theme)};
                    overflow-y: scroll;
                `}>
                    <Hits HitsComponent={HitsComponent}/>
                </div>
            </div>
            <ErrorCatcher onError={async () => {
                await fetchCustomToken()
                client.refresh()
            }}/>
        </InstantSearch>
    ) : <Loader/>
}
