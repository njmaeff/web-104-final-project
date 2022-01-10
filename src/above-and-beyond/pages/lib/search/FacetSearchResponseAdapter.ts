import {Utils} from "./support/utils";

export class FacetSearchResponseAdapter extends Utils {
    _adaptFacetHits(typesenseFacetCounts) {
        let adaptedResult = {};
        const facet = typesenseFacetCounts.find((facet) => facet.field_name === this.instantsearchRequest.params.facetName);

        adaptedResult = facet.counts.map((facetCount) => ({
            value: facetCount.value,
            highlighted: this._adaptHighlightTag(
                facetCount.highlighted,
                this.instantsearchRequest.params.highlightPreTag,
                this.instantsearchRequest.params.highlightPostTag
            ),
            count: facetCount.count,
        }));

        return adaptedResult;
    }

    adapt() {
        return {
            facetHits: this._adaptFacetHits(this.typesenseResponse.facet_counts),
            exhaustiveFacetsCount: true,
            processingTimeMS: this.typesenseResponse.search_time_ms,
        };
    }

    constructor(public typesenseResponse, public instantsearchRequest) {
        super()
    }
}
