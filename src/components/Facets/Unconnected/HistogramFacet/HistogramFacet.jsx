import React from 'react';
import ModalHistogramFacet from './ModalHistogramFacet';
// import { useAppConfig } from '@eeacms/search/lib/hocs';

const HistogramFacet = (props) => {
  const { facets, filters, field, onSelect, state, title, label } = props; // , filters
  const filterValue = filters.find((f) => f.field === field);

  // copied from react-search-ui/Facet.jsx
  // By using `[0]`, we are currently assuming only 1 facet per field. This
  // will likely be enforced in future version, so instead of an array, there
  // will only be one facet allowed per field.
  const facetsForField = facets[field];
  const facet = facetsForField?.[0] || {};

  const value = state?.length
    ? [state[0].from, state[0].to]
    : filterValue
    ? [filterValue.values?.[0]?.from, filterValue.values?.[0]?.to]
    : null;

  // const { appConfig } = useAppConfig();
  // const facetConfig = appConfig.facets.find((f) => f.field === field);

  return props.active && facet?.data ? (
    <ModalHistogramFacet
      {...props}
      data={facet?.data}
      selection={value}
      title={title || label}
      onChange={({ to, from }) => {
        // onSelect([], true);
        if (to || from) {
          onSelect([{ to, from, type: 'range' }], true);
        } else {
          onSelect([], true);
        }
      }}
    />
  ) : null;
};

export default HistogramFacet;