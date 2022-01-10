import {Configuration} from "./Configuration";
import {SearchClient as TypesenseSearchClient} from "typesense";
import {SearchRequestAdapter} from "./SearchRequestAdapter";
import {SearchResponseAdapter} from "./SearchResponseAdapter";
import {FacetSearchResponseAdapter} from "./FacetSearchResponseAdapter";

export class TypesenseInstantsearchAdapter {
    clearCache() {
        this._clearCache()
    }

    search(instantSearchRequests) {
        instantSearchRequests.forEach((request) => {
            const filters = request.params.facetFilters ?? []
            filters.push(...this.configuration.facetFilters)
            request.params.facetFilters = filters
        });

        return this.searchTypesenseAndAdapt(instantSearchRequests)
    }

    searchForFacetValues(instantSearchRequests) {
        return this.searchTypesenseForFacetValuesAndAdapt(instantSearchRequests)
    }

    private async searchTypesenseAndAdapt(instantsearchRequests) {
        let typesenseResponse;
        try {
            typesenseResponse = await this._adaptAndPerformTypesenseRequest(instantsearchRequests);

            const adaptedResponses = typesenseResponse.results.map((typesenseResult, index) => {
                this._validateTypesenseResult(typesenseResult);
                const responseAdapter = new SearchResponseAdapter(
                    typesenseResult,
                    instantsearchRequests[index],
                    this.configuration
                );
                return responseAdapter.adapt();
            });

            return {
                results: adaptedResponses,
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    private async searchTypesenseForFacetValuesAndAdapt(instantsearchRequests) {
        let typesenseResponse;
        try {
            typesenseResponse = await this._adaptAndPerformTypesenseRequest(instantsearchRequests);

            const adaptedResponses = typesenseResponse.results.map((typesenseResult, index) => {
                this._validateTypesenseResult(typesenseResult);
                const responseAdapter = new FacetSearchResponseAdapter(
                    typesenseResult,
                    instantsearchRequests[index],
                    this.configuration
                );
                return responseAdapter.adapt();
            });

            return adaptedResponses;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    private _adaptAndPerformTypesenseRequest(instantsearchRequests) {
        const requestAdapter = new SearchRequestAdapter(instantsearchRequests, this.typesenseClient, this.configuration);
        return requestAdapter.request();
    }

    private _clearCache() {
        this.typesenseClient = new TypesenseSearchClient(this.configuration.server);
        return this;
    }

    private _validateTypesenseResult(typesenseResult) {
        if (typesenseResult.error) {
            throw new Error(`${typesenseResult.code} - ${typesenseResult.error}`);
        }
        if (!typesenseResult.hits && !typesenseResult.grouped_hits) {
            throw new Error(`Did not find any hits. ${typesenseResult.code} - ${typesenseResult.error}`);
        }
    }

    constructor(options) {
        this.configuration = new Configuration(options);
        this.configuration.validate();
        this.typesenseClient = new TypesenseSearchClient(this.configuration.server);
    }

    private readonly configuration: Configuration;
    private typesenseClient: TypesenseSearchClient;
}
