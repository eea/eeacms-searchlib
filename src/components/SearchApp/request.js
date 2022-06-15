import buildRequest from '@eeacms/search/lib/search/query';
import runRequest from '@eeacms/search/lib/runRequest';
import { getDefaultFilterValues } from '@eeacms/search/lib/utils';
import { resetFiltersToDefault } from '@eeacms/search/lib/search/helpers';

export function getBuckets({
  aggregations,
  fieldName,
  whitelist = [],
  blacklist = [],
}) {
  if (aggregations?.[fieldName]?.buckets?.length > 0) {
    const unfiltered_data = aggregations[fieldName].buckets.map((bucket) => ({
      // Boolean values and date values require using `key_as_string`
      value: bucket.key_as_string || bucket.key,
      count: bucket.doc_count,
    }));

    let filtered_data = blacklist.length
      ? unfiltered_data.filter(
          (bucket) => blacklist.indexOf(bucket.value) === -1,
        )
      : unfiltered_data;

    filtered_data = whitelist.length
      ? filtered_data.filter((bucket) => whitelist.indexOf(bucket.value) !== -1)
      : filtered_data;

    return [
      {
        field: fieldName,
        type: 'value',
        data: filtered_data,
      },
    ];
  }
}

export async function getFacetOptions(config, facetFieldNames) {
  let body = {
    // pass facetFieldNames as we only want the appropriate aggregations
    ...buildRequest({ filters: [] }, config, facetFieldNames),
    size: 0,
  };

  const facetsMap = Object.assign(
    {},
    ...config.facets.map((facet) => ({ [facet.field]: facet })),
  );

  const response = await runRequest(body, config);
  const aggregations = response?.body?.aggregations || {};

  return Object.assign(
    {},
    ...Object.keys(aggregations).map((name) => ({
      [name]: getBuckets({
        aggregations,
        fieldName: name,
        blacklist: facetsMap[name].blacklist,
        whitelist: facetsMap[name].whitelist,
      })?.[0]?.data?.map(({ value }) => value),
    })),
  );
}

export function resetFilters() {
  const { appConfig, searchContext } = this;

  return resetFiltersToDefault(searchContext, appConfig);
}

export function resetSearch(resetState) {
  const { appConfig, searchContext, driver } = this;

  const {
    setCurrent,
    setSearchTerm,
    setSort,
    // driver,
    addFilter,
  } = searchContext;

  const state = resetState || driver.URLManager.getStateFromURL();
  const { defaultSearchText = '', facets } = appConfig;
  setSearchTerm(state.searchTerm || defaultSearchText);

  // eslint-disable-next-line
  state.filters?.forEach((f) => addFilter(f.field, f.values, f.type));

  if (state.current) {
    setCurrent(state.current);
  }
  if (state.sortField) {
    setSort(state.sortField, state.sortDirection);
  }

  resetFiltersToDefault(searchContext, appConfig);

  // const defaultFilterValues = getDefaultFilterValues(facets);
  //
  // if (defaultFilterValues) {
  //   const presetFilters = state?.filters?.map((filter) => filter.field);
  //   Object.keys(defaultFilterValues).forEach((k) => {
  //     const { values, type = 'any' } = defaultFilterValues[k];
  //     if (!presetFilters || presetFilters?.indexOf(k) === -1) {
  //       addFilter(k, values, type);
  //     }
  //   });
  // }
}
