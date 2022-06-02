import React from 'react';
import { useAtom } from 'jotai';
import { Segment } from 'semantic-ui-react';
import { ModalFacetWrapper } from '@eeacms/search/components';
import { showFacetsAsideAtom } from '@eeacms/search/state';
import { useSearchContext, useAppConfig } from '@eeacms/search/lib/hocs';
import { hasAppliedCustomFilters } from '@eeacms/search/lib/utils';

import FacetsList from './FacetsList';

const TopFacetList = (props) => {
  const [showFacets, setShowFacets] = useAtom(showFacetsAsideAtom);
  const { appConfig } = useAppConfig();
  const searchContext = useSearchContext();
  const hasFilters =
    searchContext.filters.length > 0 &&
    hasAppliedCustomFilters(searchContext.filters, appConfig);

  React.useEffect(() => {
    if (hasFilters) setShowFacets(true);
  }, [hasFilters, setShowFacets]);

  return (
    <Segment
      className="facetslist-wrapper top-facetslist-wrapper"
      loading={props.isLoading}
    >
      {showFacets ? (
        <>
          <h4>Filter Results</h4>
          <FacetsList
            defaultWraper={ModalFacetWrapper}
            view={({ children }) => <div>{children}</div>}
          />
        </>
      ) : (
        ''
      )}
    </Segment>
  );
};

export default TopFacetList;
