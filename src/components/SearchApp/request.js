import { resetFiltersToDefault } from '@eeacms/search/lib/search/helpers';

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
  console.log('state', state);
  const { defaultSearchText = '' } = appConfig;
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
