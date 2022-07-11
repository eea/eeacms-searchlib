import React from 'react';
import { useAppConfig } from '@eeacms/search/lib/hocs';
import { Component } from '@eeacms/search/components';
import { useSearchContext } from '@eeacms/search/lib/hocs';
import { Sidebar } from 'semantic-ui-react';
import { isFilterValueDefaultValue } from '@eeacms/search/lib/search/helpers';

const WrappedFacet = (props) => {
  const { factory, wrapper, field, ...rest } = props;
  const { registry } = useAppConfig();

  const facetConfig = registry.resolve[factory];

  const FacetComponent = facetConfig.component;

  return (
    <Component
      {...rest}
      factoryName={wrapper}
      view={FacetComponent}
      field={field}
    />
  );
};

const DropdownFacetsList = ({ defaultWrapper }) => {
  const { appConfig } = useAppConfig();
  const searchContext = useSearchContext();
  const { facets = [] } = appConfig;
  const { filters = [], clearFilters } = searchContext;

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

  // console.log('filterInfo', {
  //   filters,
  //   filterNames,
  //   facets,
  //   filtersByKey,
  //   filterableFacets,
  //   alwaysVisibleFacets,
  //   activeFacets,
  //   dropdownFacets,
  // });

  const dropdownFacetFields = dropdownFacets.map((f) => f.field);
  const sidebarFacets = filterableFacets.filter(
    (f) => !dropdownFacetFields.includes(f.field),
  );

  return (
    <div className="dropdown-facets-list">
      <div className="horizontal-dropdown-facets">
        {dropdownFacets.map((facetInfo, i) => (
          <WrappedFacet key={i} {...facetInfo} wrapper="DropdownFacetWrapper" />
        ))}
      </div>
      <button onClick={() => setShowSidebar(true)}>More filters</button>
      <Sidebar
        visible={showSidebar}
        animation="overlay"
        icon="labeled"
        width="wide"
        direction="right"
      >
        <div className="sidebar-content">
          {sidebarFacets.map((facetInfo, i) => (
            <WrappedFacet
              key={i}
              {...facetInfo}
              wrapper="AccordionFacetWrapper"
            />
          ))}
        </div>
      </Sidebar>
    </div>
  );
};

export default DropdownFacetsList;
