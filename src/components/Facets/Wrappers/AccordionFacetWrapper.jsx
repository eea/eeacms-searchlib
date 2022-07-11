import React from 'react';
import { withSearch } from '@elastic/react-search-ui'; // , Facet as SUIFacet
import { Accordion, Icon } from 'semantic-ui-react';
import { useAtom } from 'jotai';
import { openFacetsAtom } from '../state';
import { useUpdateAtom } from 'jotai/utils';
import { useAppConfig } from '@eeacms/search/lib/hocs';
import Facet from '../Facet';

const AccordionFacetWrapperComponent = (props) => {
  const { collapsable = true, filters = [], field, label } = props;
  const hasFilter = !!filters.find((filter) => field === filter.field);
  const [openFacets] = useAtom(openFacetsAtom);
  const updateOpenFacets = useUpdateAtom(openFacetsAtom);

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

  React.useEffect(() => {
    let temp = openFacets;
    if (hasFilter && !(field in openFacets)) {
      temp[field] = { opened: true };
    } else {
      if (!(field in openFacets)) {
        temp[field] = { opened: false };
      }
    }
    updateOpenFacets(temp);
  }, [hasFilter, field, openFacets, updateOpenFacets]);

  let isOpened = openFacets[field]?.opened || false;
  const [counter, setCounter] = React.useState(0);

  return collapsable ? (
    <Accordion>
      <Accordion.Title
        active={isOpened}
        onClick={() => {
          setCounter(counter + 1); // Force render
          let temp = openFacets;
          if (isOpened) {
            temp[field] = { opened: false };
            isOpened = false;
          } else {
            temp[field] = { opened: true };
            isOpened = true;
          }
          updateOpenFacets(temp);
        }}
      >
        {label}
        <Icon className="ri-arrow-down-s-line" />
      </Accordion.Title>
      <Accordion.Content active={isOpened}>
        <Facet
          {...props}
          active={isOpened}
          filterType={localFilterType}
          onChangeFilterType={(v) => setLocalFilterType(v)}
        />
      </Accordion.Content>
    </Accordion>
  ) : (
    <Facet
      {...props}
      filterType={localFilterType}
      onChangeFilterType={(v) => setLocalFilterType(v)}
    />
  );
};

const AccordionFacetWrapper = withSearch(
  ({ filters, facets, addFilter, removeFilter, setFilter, a11yNotify }) => ({
    filters,
    facets,
    addFilter,
    removeFilter,
    setFilter,
    a11yNotify,
  }),
)(AccordionFacetWrapperComponent);

export default AccordionFacetWrapper;
