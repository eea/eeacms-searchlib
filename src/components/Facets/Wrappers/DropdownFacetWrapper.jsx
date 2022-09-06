import React from 'react';
import {
  useAppConfig,
  useProxiedSearchContext,
  useSearchContext,
  useOutsideClick,
  // SearchContext,
} from '@eeacms/search/lib/hocs';
import { Facet as SUIFacet } from '@eeacms/search/components';
import { Dropdown, Button, Dimmer } from 'semantic-ui-react'; // Button
import { atomFamily } from 'jotai/utils';
import { useAtom, atom } from 'jotai';

const dropdownOpenFamily = atomFamily(
  (name) => atom(false),
  (a, b) => a === b,
);

const DropdownFacetWrapper = (props) => {
  const { field, label, title, removeFilter } = props;
  // console.log('redraw dropdown facet', field);
  const rawSearchContext = useSearchContext();
  const {
    searchContext: facetSearchContext,
    // applySearch,
  } = useProxiedSearchContext(rawSearchContext);
  const { filters } = facetSearchContext;

  const { appConfig } = useAppConfig();
  const facet = appConfig.facets?.find((f) => f.field === field);
  const fallback = props.filterType ? props.filterType : facet.filterType;
  const defaultValue = field
    ? filters?.find((f) => f.field === field)?.type || fallback
    : fallback;
  const filtersCount = filters
    .filter((filter) => filter.field === field)
    .map((filter) => filter.values.length);
  const filterConfig = appConfig.facets.find(
    (f) => (f.id || f.field) === field,
  );
  const activeFilters =
    (filters.find((f) => f.field === field) || {})?.values || [];

  const [defaultTypeValue] = (defaultValue || '').split(':');

  const [localFilterType, setLocalFilterType] = React.useState(
    defaultTypeValue,
  );
  const dropdownAtom = dropdownOpenFamily(field);
  const [isOpen, setIsOpen] = useAtom(dropdownAtom);
  // const [isOpen, setIsOpen] = React.useState(false);
  const nodeRef = React.useRef();

  useOutsideClick(nodeRef, () => setIsOpen(false));

  return (
    <>
      <Dimmer active={isOpen} verticalAlign="top" className="facet-dimmer" />
      <div className="dropdown-facet" ref={nodeRef}>
        <Dropdown
          open={isOpen}
          onClick={() => setIsOpen(true)}
          trigger={
            <span>
              {label ? <>{label} </> : <>{title} </>}
              <i aria-hidden="true" class="icon ri-arrow-down-s-line"></i>
            </span>
          }
        >
          <Dropdown.Menu>
            <span className="facet-label">
              {props.label}{' '}
              {filtersCount.length > 0 && (
                <span className="count">({filtersCount})</span>
              )}
            </span>
            {activeFilters.length > 0 && (
              <Button
                className="clear-filters"
                size="mini"
                onClick={() => {
                  if (Array.isArray(activeFilters)) {
                    (activeFilters || []).forEach((v) => {
                      removeFilter(field, v, filterConfig.filterType);
                    });
                  } else {
                    removeFilter(
                      field,
                      [activeFilters || ''],
                      filterConfig.filterType,
                    );
                  }
                  setIsOpen(false);
                }}
              >
                clear selected
              </Button>
            )}
            {isOpen && (
              <SUIFacet
                {...props}
                active={isOpen}
                filterType={localFilterType}
                onChangeFilterType={setLocalFilterType}
              />
            )}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </>
  );
};

export default DropdownFacetWrapper;

// {/* <SearchContext.Provider value={facetSearchContext}>
//   <SUIFacet
//     {...props}
//     active={isOpen}
//     filterType={localFilterType}
//     onChangeFilterType={setLocalFilterType}
//   />
// </SearchContext.Provider>
// <div>
//   <Button
//     onClick={() => {
//       applySearch();
//       setIsOpen(false);
//     }}
//   >
//     Apply
//   </Button>
// </div>  */}
