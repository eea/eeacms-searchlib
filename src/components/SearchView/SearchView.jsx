import React from 'react';
import { useAtom } from 'jotai';

import { withAppConfig } from '@eeacms/search/lib/hocs';
import { FacetsList, SearchBox, AppInfo } from '@eeacms/search/components';
import registry from '@eeacms/search/registry';
import { SearchContext as SUISearchContext } from '@elastic/react-search-ui';

import { checkInteracted } from './utils';
import { BodyContent } from './BodyContent';
import { isLandingPageAtom } from './state';
import { useSearchContext } from '@eeacms/search/lib/hocs';

export const SearchView = (props) => {
  const {
    appConfig,
    appName,
    wasSearched,
    filters,
    mode = 'view',
    // searchTerm,
  } = props;

  const { driver } = React.useContext(SUISearchContext);

  const [isLandingPage, setIsLandingPageAtom] = useAtom(isLandingPageAtom);

  const InitialViewComponent =
    appConfig.initialView?.factory &&
    registry.resolve[appConfig.initialView.factory].component;

  const FacetsListComponent = appConfig.facetsListComponent
    ? registry.resolve[appConfig.facetsListComponent].component
    : FacetsList;

  // const itemViewProps = listingViewDef.params;
  const Layout = registry.resolve[appConfig.layoutComponent].component;

  const searchedTerm = driver.URLManager.getStateFromURL().searchTerm;
  console.log('searchedTerm', searchedTerm);
  const searchContext = useSearchContext();

  const { resultSearchTerm } = searchContext;

  const wasInteracted = checkInteracted({
    wasSearched,
    filters,
    searchTerm: resultSearchTerm, //: searchedTerm,
    appConfig,
  });

  React.useEffect(() => {
    setIsLandingPageAtom(!wasInteracted);
  });

  const customClassName = isLandingPage ? 'landing-page' : 'simple-page';

  React.useEffect(() => {
    // TODO: use searchui alwaysSearchOnInitialLoad ?
    if (!wasSearched && !InitialViewComponent) {
      console.log('call resetSearch');
      searchContext.resetSearch();
    }
    window.searchContext = searchContext;
  }, [searchContext, InitialViewComponent, wasSearched]);

  return (
    <div className={`searchapp searchapp-${appName} ${customClassName}`}>
      <Layout
        appConfig={appConfig}
        header={
          <SearchBox
            searchContext={searchContext}
            isLandingPage={isLandingPage}
            autocompleteMinimumCharacters={3}
            autocompleteResults={appConfig.autocomplete.results}
            autocompleteSuggestions={appConfig.autocomplete.suggestions}
            shouldClearFilters={false}
            useSearchPhrases={appConfig.useSearchPhrases}
            inputView={
              appConfig.searchBoxInputComponent
                ? registry.resolve[appConfig.searchBoxInputComponent].component
                : undefined
            }
            view={
              appConfig.searchBoxComponent
                ? registry.resolve[appConfig.searchBoxComponent].component
                : undefined
            }
            mode={mode}
          />
        }
        sideContent={<FacetsListComponent />}
        bodyHeader={null}
        bodyContent={<BodyContent {...props} wasInteracted={wasInteracted} />}
        bodyFooter={<AppInfo appConfig={appConfig} />}
      />
    </div>
  );
};

export default withAppConfig(SearchView);
