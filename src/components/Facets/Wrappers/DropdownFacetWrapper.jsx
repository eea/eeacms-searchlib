import React from 'react';

import { withSearch } from '@elastic/react-search-ui';
import { useAppConfig } from '@eeacms/search/lib/hocs';
import { Facet as SUIFacet } from '@eeacms/search/components';
import { Dropdown } from 'semantic-ui-react';

const DropdownFacetWrapperComponent = (props) => {
  const { filters = [], field, label, title } = props;

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
          <SUIFacet
            {...props}
            filterType={localFilterType}
            onChangeFilterType={(v) => setLocalFilterType(v)}
          />
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

const DropdownFacetWrapper = withSearch(
  ({ filters, facets, addFilter, removeFilter, setFilter, a11yNotify }) => ({
    filters,
    facets,
    addFilter,
    removeFilter,
    setFilter,
    a11yNotify,
  }),
)(DropdownFacetWrapperComponent);

export default DropdownFacetWrapper;
