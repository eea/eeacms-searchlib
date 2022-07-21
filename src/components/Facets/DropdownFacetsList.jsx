import React from 'react';
import { useAppConfig } from '@eeacms/search/lib/hocs';
import {
  useSearchContext,
  useProxiedSearchContext,
  SearchContext,
} from '@eeacms/search/lib/hocs';
import { Button } from 'semantic-ui-react';
import { isFilterValueDefaultValue } from '@eeacms/search/lib/search/helpers';

import FacetResolver from './FacetResolver';
import SidebarFacetsList from './SidebarFacetsList';
import { sidebarState } from './state';
import { useAtom } from 'jotai';

const DropdownFacetsList = ({ defaultWrapper }) => {
  const { appConfig } = useAppConfig();
  const rawSearchContext = useSearchContext();
  const { filters } = rawSearchContext;
  const {
    searchContext: sidebarSearchContext,
    applySearch,
  } = useProxiedSearchContext(rawSearchContext);
  const { facets = [] } = appConfig;

  const [showSidebar, setShowSidebar] = useAtom(sidebarState);

  const filterableFacets = facets.filter(
    (f) => !f.isFilter && f.showInFacetsList,
  );
  const facetNames = filterableFacets.map((f) => f.field);

  const filterNames = filters
    .filter((f) => facetNames.includes(f.field))
    .map((f) => f.field);

  const alwaysVisibleFacets = filterableFacets.filter((f) => f.alwaysVisible);
  const alwaysVisibleFacetNames = alwaysVisibleFacets.map((f) => f.field);

  const filtersByKey = filters.reduce(
    (acc, cur) => ({ ...acc, [cur.field]: cur }),
    {},
  );

  const activeFacets = filterableFacets.filter(
    (f) =>
      filterNames.includes(f.field) &&
      !alwaysVisibleFacetNames.includes(f.field) &&
      !isFilterValueDefaultValue(filtersByKey[f.field], appConfig),
  );

  const dropdownFacets = [...alwaysVisibleFacets, ...activeFacets];

  const dropdownFacetFields = dropdownFacets.map((f) => f.field);
  const sidebarFacets = filterableFacets.filter(
    (f) => !dropdownFacetFields.includes(f.field),
  );

  const liveSidebar = true;

  return (
    <div className="dropdown-facets-list">
      <div className="horizontal-dropdown-facets">
        {dropdownFacets.map((facetInfo, i) => (
          <FacetResolver
            key={i}
            {...facetInfo}
            {...rawSearchContext}
            wrapper="DropdownFacetWrapper"
          />
        ))}
        <Button
          className="sui-button basic"
          onClick={() => setShowSidebar(true)}
        >
          + Add filters
        </Button>
      </div>
      {!liveSidebar ? (
        <SearchContext.Provider value={sidebarSearchContext}>
          <SidebarFacetsList
            open={showSidebar}
            onClose={() => setShowSidebar(false)}
            facets={sidebarFacets}
            applySearch={applySearch}
          />
        </SearchContext.Provider>
      ) : (
        <SidebarFacetsList
          open={showSidebar}
          onClose={() => setShowSidebar(false)}
          facets={sidebarFacets}
        />
      )}
    </div>
  );
};

export default DropdownFacetsList;
