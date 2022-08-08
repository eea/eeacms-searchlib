import React from 'react';
import {
  useAppConfig,
  useProxiedSearchContext,
  useSearchContext,
  useOutsideClick,
  // SearchContext,
} from '@eeacms/search/lib/hocs';
import { Facet as SUIFacet } from '@eeacms/search/components';
import { Dropdown } from 'semantic-ui-react'; // Button
import { atomFamily } from 'jotai/utils';
import { useAtom, atom } from 'jotai';

const dropdownOpenFamily = atomFamily(
  (name) => atom(false),
  (a, b) => a === b,
);

const DropdownFacetWrapper = (props) => {
  const { field, label, title } = props;
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

  const [defaultTypeValue] = (defaultValue || '').split(':');

  const [localFilterType, setLocalFilterType] = React.useState(
    defaultTypeValue,
  );
  const dropdownAtom = dropdownOpenFamily(field);
  const [isOpen, setIsOpen] = useAtom(dropdownAtom);
  // const [isOpen, setIsOpen] = React.useState(false);
  const nodeRef = React.useRef();

  useOutsideClick(nodeRef, () => setIsOpen(false));

  const filtersCount = filters
    .filter((filter) => filter.field === field)
    .map((filter) => filter.values.length);

  return (
    <div className="dropdown-facet" ref={nodeRef}>
      <Dropdown
        open={isOpen}
        onClick={() => setIsOpen(true)}
        trigger={
          <span>
            {label ? <>{label} </> : <>{title} </>}
            {filtersCount.length > 0 && (
              <span className="count">({filtersCount})</span>
            )}
          </span>
        }
      >
        <Dropdown.Menu open={isOpen}>
          <SUIFacet
            {...props}
            active={isOpen}
            filterType={localFilterType}
            onChangeFilterType={setLocalFilterType}
          />
        </Dropdown.Menu>
      </Dropdown>
    </div>
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
