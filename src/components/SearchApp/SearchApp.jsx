import React from 'react';

import {
  SearchProvider,
  WithSearch,
  SearchContext as SUISearchContext,
} from '@elastic/react-search-ui'; // ErrorBoundary,
import {
  AppConfigContext,
  SearchContext,
  useIsMounted,
} from '@eeacms/search/lib/hocs';
import { getDefaultFilterValues } from '@eeacms/search/lib/utils';
import { SearchView } from '@eeacms/search/components/SearchView/SearchView';
import { rebind, applyConfigurationSchema } from '@eeacms/search/lib/utils';
import {
  onResultClick,
  onAutocompleteResultClick,
  bindOnAutocomplete,
  bindOnSearch,
} from '@eeacms/search/lib/request';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { getFacetOptions } from './request';
import { resetFiltersToDefault } from '@eeacms/search/lib/search/helpers';

// import '@elastic/react-search-ui-views/lib/styles/styles.css';

function resetFilters() {
  const { appConfig, searchContext } = this;

  return resetFiltersToDefault(searchContext, appConfig);
}

function resetSearch() {
  const { appConfig, searchContext, driver } = this;

  const {
    setCurrent,
    setSearchTerm,
    setSort,
    // driver,
    addFilter,
  } = searchContext;

  const state = driver.URLManager.getStateFromURL();
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

  const defaultFilterValues = getDefaultFilterValues(facets);

  if (defaultFilterValues) {
    const presetFilters = state?.filters?.map((filter) => filter.field);
    Object.keys(defaultFilterValues).forEach((k) => {
      const { values, type = 'any' } = defaultFilterValues[k];
      if (!presetFilters || presetFilters?.indexOf(k) === -1) {
        addFilter(k, values, type);
      }
    });
  }

  console.log('done reset');
}

function MapDriver({ children }) {
  const { driver } = React.useContext(SUISearchContext);
  return children({ driver });
}

function SearchWrappers({
  params,
  appConfigContext,
  appName,
  appConfig,
  mode,
}) {
  // const { driver } = React.useContext(SUISearchContext);
  return (
    <AppConfigContext.Provider value={appConfigContext}>
      <SearchContext.Provider value={params}>
        <SearchView
          {...params}
          appName={appName}
          appConfig={appConfig}
          mode={mode}
        />
      </SearchContext.Provider>
    </AppConfigContext.Provider>
  );
}

function SearchApp(props) {
  const {
    appName,
    registry,
    mode = 'view',
    paramOnSearch = bindOnSearch,
    paramOnAutocomplete = bindOnAutocomplete,
  } = props;

  const appConfig = React.useMemo(
    () => applyConfigurationSchema(rebind(registry.searchui[appName])),
    [appName, registry],
  );

  const isMountedRef = useIsMounted();
  const [facetOptions, setFacetOptions] = React.useState(); // cache for all facet values, for some facets;

  const appConfigContext = React.useMemo(() => ({ appConfig, registry }), [
    appConfig,
    registry,
  ]);

  // <ErrorBoundary>
  // </ErrorBoundary>
  // const searchFuncs = {
  //   // TODO: these needs to be read from the registry
  //   onResultClick: onResultClick.bind(appConfig),
  //   onAutocompleteResultClick: onAutocompleteResultClick.bind(appConfig),
  //   onAutocomplete: onAutocomplete.bind(appConfig),
  //   onSearch: onSearch.bind(appConfig),
  // };
  const [isLoading, setIsLoading] = React.useState(false);

  const boundOnSearch = React.useMemo(() => paramOnSearch(appConfig), [
    appConfig,
    paramOnSearch,
  ]);
  const onSearch = React.useCallback(
    async (state) => {
      setIsLoading(true);
      console.log('searching');
      const res = await boundOnSearch(state);
      console.log('search done', res);
      setIsLoading(false);
      return res;
    },
    [boundOnSearch],
  );

  const onAutocomplete = React.useMemo(() => paramOnAutocomplete(appConfig), [
    appConfig,
    paramOnAutocomplete,
  ]);

  const config = React.useMemo(
    () => ({
      ...appConfig,
      onResultClick,
      onAutocompleteResultClick,
      onAutocomplete,
      onSearch,
      initialState: {
        resultsPerPage: appConfig.resultsPerPage || 20,
      },
    }),
    [appConfig, onAutocomplete, onSearch],
  );

  // construct a data structure of all available options for all the facets
  const fetchFacetOptions = React.useCallback(
    async (facetFieldNames) => {
      const facetNames = appConfig.facets
        .filter((f) => f.showAllOptions)
        .map((f) => f.field);
      const facetOptions = await getFacetOptions(appConfig, facetNames);
      isMountedRef.current && setFacetOptions(facetOptions);
    },
    [appConfig, isMountedRef],
  );

  const facetsWithAllOptions =
    appConfig.facets?.filter((f) => f.showAllOptions) || [];

  useDeepCompareEffect(() => {
    fetchFacetOptions(facetsWithAllOptions);
  }, [facetsWithAllOptions, fetchFacetOptions]);

  return (
    <SearchProvider config={config}>
      <MapDriver>
        {({ driver }) => (
          <WithSearch
            mapContextToProps={(searchContext) => ({
              ...searchContext,
              driver,
              isLoading,
              resetFilters: resetFilters.bind({ appConfig, searchContext }),
              resetSearch: resetSearch.bind({ searchContext, appConfig }),
              facetOptions,
            })}
          >
            {(params) => (
              <SearchWrappers
                params={params}
                appConfigContext={appConfigContext}
                appName={appName}
                appConfig={appConfig}
                mode={mode}
              />
            )}
          </WithSearch>
        )}
      </MapDriver>
    </SearchProvider>
  );
}

export default React.memo(SearchApp, () => true);
