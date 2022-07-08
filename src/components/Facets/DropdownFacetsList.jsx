import React from 'react';
import { useAppConfig } from '@eeacms/search/lib/hocs';
import { Component } from '@eeacms/search/components';
import { useSearchContext } from '@eeacms/search/lib/hocs';
import { Sidebar } from 'semantic-ui-react';

const WrappedFacet = (props) => {
  const { factory, wrapper, field, ...rest } = props;
  console.log('wrapped facet', props);
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

  const facetValues = facets
    .filter((f) => !f.isFilter && f.showInFacetsList)
    .map((f) => f.field);

  const filterValues = filters
    .filter((f) => facetValues.includes(f.field))
    .map((f) => f.field);

  const alwaysVisibleFacets = facets
    .filter((f) => f.alwaysVisible)
    .map((f) => f.field);

  const dropdownFacets = [...alwaysVisibleFacets];
  const invisibleFacets = [];

  return (
    <div className="dropdown-facets-list">
      <div className="horizontal-dropdown-facets">
        {facets
          .filter((f) => f.showInFacetsList)
          .map((facetInfo, i) => (
            <WrappedFacet
              key={i}
              {...facetInfo}
              wrapper="DropdownFacetWrapper"
            />
          ))}
      </div>
      <button onClick={() => setShowSidebar(true)}>More filters</button>
      <Sidebar
        visible={showSidebar}
        animation="overlay"
        icon="labeled"
        inverted
        width="wide"
        direction="right"
      >
        <div className="sidebar-content">
          {invisibleFacets
            .filter((f) => f.showInFacetsList)
            .map((data, i) => null)}
        </div>
      </Sidebar>
    </div>
  );
};

// <Facet data={data} key={i} defaultWrapper={defaultWrapper} />

export default DropdownFacetsList;

// const [isOpened, setIsOpened] = React.useState();
// const [visibleFacets, setVisibleFacets] = useAtom(visibleFacetsAtom);
// const [selectFilters, setSelectFilters] = React.useState(visibleFacets);
// const { current: defaultValues } = React.useRef(filterValues);
// const { current: selectFiltersValues } = React.useRef(selectFilters);

// React.useEffect(() => {
//   const allFilters = [...new Set([...defaultValues, ...selectFiltersValues])];
//   setVisibleFacets(allFilters);
// }, [setVisibleFacets, selectFiltersValues, defaultValues]);
//
//  <div className="facet-list-header dropdown-facet-list">
//      <Button
//        basic
//        className="clear-btn"
//        content="clear all filters"
//        onClick={() => {
//          searchContext.resetFilters();
//          // const exclude = facets
//          //   .filter((f) => f.isFilter)
//          //   .map((f) => f.field);
//          // clearFilters(exclude);
//          // setVisibleFacets(alwaysVisibleFacets);
//        }}
//      />
//    </div>
//
// import { Modal, Button, Icon, Card } from 'semantic-ui-react';
// import { useAtom } from 'jotai';
// import { visibleFacetsAtom } from './state';
// const Facet = ({
//   data,
//   // info,
//   // defaultWrapper,
//   // filters,
//   // selectedFilters,
//   // visibleFacets,
// }) => {
//   // const { factory } = info; // , wrapper
//   return null;
//   // const facet = registry.resolve[factory];
//
//   // const FacetWrapperComponent = wrapper ? Component : defaultWrapper;
//   // const props = {
//   //   ...info,
//   //   ...info.params,
//   //   // ...facet,
//   // };
//   // const { field } = info;
//   // const Facet = React.useCallback(
//   //   (props) => <Component factoryName={factory} {...props} field={field} />,
//   //   [factory, field],
//   // );
//   //
//   // return (
//   //   <FacetWrapperComponent
//   //     {...props}
//   //     factoryName={wrapper}
//   //     field={info.field}
//   //     view={Facet}
//   //   />
//   // );
//
//   // return (
//   //   <>
//   //     {visibleFacets.map((filter, i) => {
//   //       return info.field === filter ? (
//   //         <FacetWrapperComponent
//   //           {...props}
//   //           factoryName={wrapper}
//   //           field={info.field}
//   //           view={Facet}
//   //           key={i}
//   //         />
//   //       ) : null;
//   //     })}
//   //   </>
//   // );
// };
