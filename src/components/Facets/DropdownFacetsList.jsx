import React from 'react';
import { useAppConfig } from '@eeacms/search/lib/hocs';
import {
  useSearchContext,
  useOutsideClick,
  useProxiedSearchContext,
  SearchContext,
} from '@eeacms/search/lib/hocs';
import { Button } from 'semantic-ui-react';
import { isFilterValueDefaultValue } from '@eeacms/search/lib/search/helpers';

import FacetResolver from './FacetResolver';
import SidebarFacetsList from './SidebarFacetsList';

const DropdownFacetsList = ({ defaultWrapper }) => {
  const { appConfig } = useAppConfig();
  const rawSearchContext = useSearchContext();
  const {
    searchContext: sidebarSearchContext,
    filters,
    doSearch,
  } = useProxiedSearchContext(rawSearchContext);
  const { facets = [] } = appConfig;

  const [showSidebar, setShowSidebar] = React.useState(false);

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

  // console.log('searchContext', searchContext);

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
      <SearchContext.Provider value={sidebarSearchContext}>
        <SidebarFacetsList
          open={showSidebar}
          onClose={() => setShowSidebar(false)}
          facets={sidebarFacets}
        />
      </SearchContext.Provider>
      <button onClick={doSearch}>Do search</button>
    </div>
  );
};

export default DropdownFacetsList;
