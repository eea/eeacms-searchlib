import React from 'react';
import { useAtom } from 'jotai';
import { Card, Segment } from 'semantic-ui-react';

import { ModalFacetWrapper } from '@eeacms/search/components';
import { showFacetsAsideAtom } from '@eeacms/search/state';
import { useSearchContext, useAppConfig } from '@eeacms/search/lib/hocs';
import { hasAppliedCustomFilters } from '@eeacms/search/lib/utils';

import FacetsList from './FacetsList';

const TopFacetList = ({ isLoading }) => {
  return (
    <Segment
      className="facetslist-wrapper top-facetslist-wrapper"
      loading={isLoading}
    >
      <FacetsList
        defaultWraper={ModalFacetWrapper}
        view={({ children }) => (
          <Card.Group stackable itemsPerRow={6}>
            {children}
          </Card.Group>
        )}
      />
    </Segment>
  );
};

export default () => {
  const [, setShowFacets] = useAtom(showFacetsAsideAtom);
  const { appConfig } = useAppConfig();
  const searchContext = useSearchContext();
  const hasFilters =
    searchContext.filters.length > 0 &&
    hasAppliedCustomFilters(searchContext.filters, appConfig);

  React.useEffect(() => {
    if (hasFilters) setShowFacets(true);
  }, [hasFilters, setShowFacets]);

  return <TopFacetList {...searchContext} />;
};
