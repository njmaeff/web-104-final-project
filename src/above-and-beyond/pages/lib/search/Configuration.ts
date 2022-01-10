export class Configuration {
    facetFilters: any[];
    /*
     * Either additionalSearchParameters.queryBy needs to be set, or
     *   All collectionSpecificSearchParameters need to have queryBy
     *
     * */
    validate() {
        if (
            this.additionalSearchParameters.queryBy.length === 0 &&
            Object.values(this.collectionSpecificSearchParameters).some((c) => (c.queryBy || "").length === 0)
        ) {
            throw new Error(
                "Missing parameter: Either additionalSearchParameters.queryBy needs to be set, or all collectionSpecificSearchParameters need to have .queryBy set"
            );
        }
    }

    constructor(options = {}) {
        this.server = options.server || {
            nodes: [
                {
                    host: "localhost",
                    port: "8108",
                    path: "",
                    protocol: "http",
                },
            ],
        };
        this.facetFilters = options.facetFilters
        this.server.cacheSearchResultsForSeconds =
            this.server.cacheSearchResultsForSeconds == null ? 2 * 60 : this.server.cacheSearchResultsForSeconds;

        this.additionalSearchParameters = options.additionalSearchParameters || {};

        this.additionalSearchParameters.queryBy = this.additionalSearchParameters.queryBy || "";

        this.additionalSearchParameters.sortBy = this.additionalSearchParameters.sortBy || "";

        this.additionalSearchParameters.highlightFullFields =
            this.additionalSearchParameters.highlightFullFields || this.additionalSearchParameters.queryBy;

        this.geoLocationField = options.geoLocationField || "_geoloc";

        this.collectionSpecificSearchParameters = options.collectionSpecificSearchParameters || {};

        Object.keys(this.collectionSpecificSearchParameters).forEach((collection) => {
            const overrideHighlightFullFields =
                this.collectionSpecificSearchParameters[collection].highlightFullFields ||
                this.collectionSpecificSearchParameters[collection].queryBy;
            if (overrideHighlightFullFields) {
                this.collectionSpecificSearchParameters[collection].highlightFullFields = overrideHighlightFullFields;
            }
        });
    }

    server: any;
}
