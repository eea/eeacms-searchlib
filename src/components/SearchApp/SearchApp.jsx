import React from 'react';

import {
  SearchProvider,
  WithSearch,
  SearchContext as SUISearchContext,
} from '@elastic/react-search-ui'; // ErrorBoundary,
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
              resetSearch: resetSearch.bind({
                searchContext,
                appConfig,
                driver,
              }),
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
