import React from 'react';

import {
  useAppConfig,
  useProxiedSearchContext,
  SearchContext,
  useSearchContext,
} from '@eeacms/search/lib/hocs';
import { Facet as SUIFacet } from '@eeacms/search/components';
import { Button, Dropdown } from 'semantic-ui-react';

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

  return (
    <div className="dropdown-facet">
      <Dropdown text={label || title} icon="chevron down">
        <Dropdown.Menu>
          <SearchContext.Provider value={facetSearchContext}>
            <SUIFacet
              {...props}
              active={true}
              filterType={localFilterType}
              onChangeFilterType={setLocalFilterType}
            />
            <div>
              <Button onClick={applySearch}>Apply</Button>
            </div>
          </SearchContext.Provider>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default DropdownFacetWrapper;
