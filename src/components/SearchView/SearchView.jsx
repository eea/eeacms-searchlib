import React from 'react';

import { withAppConfig } from '@eeacms/search/lib/hocs';
import { SearchBox, AppInfo } from '@eeacms/search/components';
import registry from '@eeacms/search/registry';
import { SearchContext as SUISearchContext } from '@elastic/react-search-ui';

import { checkInteracted } from '@eeacms/search/lib/search/helpers';
import { BodyContent } from './BodyContent';
import { useSearchContext } from '@eeacms/search/lib/hocs';

export const SearchView = (props) => {
  const { appConfig, appName, mode = 'view' } = props;

  const { driver } = React.useContext(SUISearchContext);

  const Layout = registry.resolve[appConfig.layoutComponent].component;

  const searchedTerm = driver.URLManager.getStateFromURL().searchTerm;
  const searchContext = useSearchContext();

  const wasInteracted = !!(
    searchedTerm ||
    checkInteracted({
      searchContext,
      appConfig,
    })
  );

  const customClassName = !wasInteracted ? 'landing-page' : 'simple-page';

  return (
    <div className={`searchapp searchapp-${appName} ${customClassName}`}>
      <Layout
        appConfig={appConfig}
        header={
          <SearchBox
            searchContext={searchContext}
            isLandingPage={!wasInteracted}
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
        sideContent={null}
        bodyHeader={null}
        bodyContent={<BodyContent {...props} wasInteracted={wasInteracted} />}
        bodyFooter={<AppInfo appConfig={appConfig} />}
      />
    </div>
  );
};

export default withAppConfig(SearchView);
