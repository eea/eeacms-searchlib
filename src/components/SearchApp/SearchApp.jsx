import React from 'react';

import { SearchProvider, withSearch } from '@elastic/react-search-ui'; // ErrorBoundary,    WithSearch,
import { AppConfigContext, SearchContext } from '@eeacms/search/lib/hocs';
import { SearchView } from '@eeacms/search/components/SearchView/SearchView';
import { rebind, applyConfigurationSchema } from '@eeacms/search/lib/utils';
import {
  onResultClick,
  onAutocompleteResultClick,
  bindOnAutocomplete,
  bindOnSearch,
} from '@eeacms/search/lib/request';
import { resetFilters, resetSearch } from './request';
import useFacetsWithAllOptions from './useFacetsWithAllOptions';
import { SearchDriver } from '@elastic/search-ui';

function SearchWrappers(props) {
  console.log('searchWrappers', props);
  const {
    appConfig,
    appConfigContext,
    appName,
    driver,
    facetOptions,
    isLoading,
    mode,
    ...searchContext
  } = props;

  return (
    <AppConfigContext.Provider value={appConfigContext}>
      <SearchContext.Provider value={searchContext}>
        <SearchView
          {...searchContext}
          appName={appName}
          appConfig={appConfig}
          mode={mode}
        />
      </SearchContext.Provider>
    </AppConfigContext.Provider>
  );
}

const defaultMessages = {
  moreFilters: ({ visibleOptionsCount, showingAll }) => {
    let message = showingAll ? 'All ' : '';
    message += `${visibleOptionsCount} options shown.`;
    return message;
  },
};

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

  const appConfigContext = React.useMemo(() => ({ appConfig, registry }), [
    appConfig,
    registry,
  ]);

  const [isLoading, setIsLoading] = React.useState(false);

  const onSearch = React.useCallback(
    async (state) => {
      setIsLoading(true);
      console.log('searching');
      const res = await paramOnSearch(appConfig)(state);
      console.log('search done', res);
      setIsLoading(false);
      return res;
    },
    [appConfig, paramOnSearch],
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

  const { facetOptions } = useFacetsWithAllOptions(appConfig);

  const [driverInstance, setDriverInstance] = React.useState(null);
  React.useEffect(() => {
    // This initialization is done inside of useEffect, because initializing the SearchDriver server side
    // will error out, since the driver depends on window. Placing the initialization inside of useEffect
    // assures that it won't attempt to initialize server side.
    const currentDriver = new SearchDriver(
      Object.assign(Object.assign({}, config), {
        a11yNotificationMessages: Object.assign(
          Object.assign({}, defaultMessages),
          config.a11yNotificationMessages,
        ),
      }),
    );
    setDriverInstance(currentDriver);
    return () => {
      currentDriver.tearDown();
    };
  }, [config]);

  const mapContextToProps = React.useCallback(
    (params) => {
      const driver = driverInstance;
      const searchContext = {
        ...params,
        driver,
        isLoading,
        facetOptions,
      };
      searchContext.resetFilters = resetFilters.bind({
        appConfig,
        searchContext,
      });
      searchContext.resetSearch = resetSearch.bind({
        appConfig,
        searchContext,
        driver,
      });

      return searchContext;
    },
    [appConfig, driverInstance, facetOptions, isLoading],
  );

  const WrappedSearchView = React.useMemo(
    () => withSearch(mapContextToProps)(SearchWrappers),
    [mapContextToProps],
  );

  return (
    <SearchProvider config={config} driver={driverInstance}>
      <WrappedSearchView
        appConfig={appConfig}
        appConfigContext={appConfigContext}
        appName={appName}
        driver={driverInstance}
        facetOptions={facetOptions}
        isLoading={isLoading}
        mode={mode}
      />
    </SearchProvider>
  );
}

export default React.memo(SearchApp, () => true);

// const {
//   appConfig,
//   appConfigContext,
//   appName,
//   driver,
//   facetOptions,
//   isLoading,
//   mode,
// } = props;

//    <WithSearch
//      mapContextToProps={(searchContext) => ({
//        ...searchContext,
//        driver: driverInstance,
//        isLoading,
//        resetFilters: resetFilters.bind({ appConfig, searchContext }),
//        resetSearch: resetSearch.bind({
//          searchContext,
//          appConfig,
//          driver: driverInstance,
//        }),
//        facetOptions,
//      })}
//    >
//      {(params) => (
//        <SearchWrappers
//          params={params}
//          appConfigContext={appConfigContext}
//          appName={appName}
//          appConfig={appConfig}
//          mode={mode}
//        />
//      )}
//    </WithSearch>
