import React from 'react';

import {
  useAppConfig,
  useProxiedSearchContext,
  SearchContext,
  useSearchContext,
  useOutsideClick,
} from '@eeacms/search/lib/hocs';
import { Facet as SUIFacet } from '@eeacms/search/components';
import { Button, Dropdown } from 'semantic-ui-react';
// import { atomFamily } from 'jotai/utils';
// import { useAtom, atom } from 'jotai';
//
// const dropdownOpenFamily = atomFamily(
//   (name) => atom(false),
//   (a, b) => a === b,
// );

const DropdownFacetWrapper = (props) => {
  const { field, label, title } = props;

  console.log('redraw dropdown facet', field);
  const rawSearchContext = useSearchContext();
  const {
    searchContext: facetSearchContext,
    applySearch,
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
  // const dropdownAtom = dropdownOpenFamily(field);
  // const [isOpen, setIsOpen] = useAtom(dropdownAtom);
  const [isOpen, setIsOpen] = React.useState();
  const nodeRef = React.useRef();

  useOutsideClick(nodeRef, () => setIsOpen(false));

  return (
    <div className="dropdown-facet" ref={nodeRef}>
      <Dropdown
        text={label || title}
        icon="chevron down"
        open={isOpen}
        onClick={() => setIsOpen(true)}
      >
        <Dropdown.Menu>
          {isOpen && (
            <SearchContext.Provider value={facetSearchContext}>
              <SUIFacet
                {...props}
                active={true}
                filterType={localFilterType}
                onChangeFilterType={setLocalFilterType}
              />
            </SearchContext.Provider>
          )}
          <div>
            <Button
              onClick={() => {
                applySearch();
                setIsOpen(false);
              }}
            >
              Apply
            </Button>
          </div>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default DropdownFacetWrapper;
