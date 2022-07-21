import React from 'react';
import { SearchDriver } from '@elastic/search-ui';
import { atom, useAtom } from 'jotai';

const stateFields = [
  'current',
  'filters',
  'resultsPerPage',
  'searchTerm',
  'sortDirection',
  'sortField',
  'sortList',
];

const buildDriver = (searchContext, onSearchTrigger) => {
  const initialState = Object.assign(
    {},
    stateFields.map((k) => ({ [k]: searchContext[k] })),
  );

  const driver = new SearchDriver({
    // debug: true,
    initialState,
    trackUrlState: false,
    onSearch: () =>
      new Promise(() => {
        // copy the state filters to the driver filters
        driver.filters = driver.state.filters;
        onSearchTrigger();
      }),
  });
  driver.isReplacementSearchContext = true;

  return driver;
};

const getSearchContext = (driver) => {
  const searchContext = {
    ...driver.state,
    ...driver,
  };
  return searchContext;
};

const driverAtom = atom();

export default function useProxiedSearchContext(searchContext) {
  const [driver, setDriver] = useAtom(driverAtom);
  const [, setSerial] = React.useState();

  React.useEffect(() => {
    setDriver(buildDriver(searchContext, () => setSerial(new Date())));
  }, [searchContext, setDriver]);

  const applySearch = React.useCallback(() => {
    // searchContext.reset();
    // searchContext.setCurrent(driver.state.current);
    // searchContext.setSort(driver.state.sortField, driver.state.sortDirection);
    // searchContext.setResultsPerPage(driver.state.resultsPerPage);
    // searchContext.setSearchTerm(driver.state.searchTerm);
    driver.state.filters.forEach((f) =>
      // searchContext.addFilter.apply(searchContext, f),
      searchContext.addFilter(f.field, f.values, f.type),
    );
  }, [searchContext, driver]);

  const sc = driver ? getSearchContext(driver) : searchContext;
  if (driver) {
    sc.facets = searchContext.facets; // this is updated async
  }

  const res = {
    searchContext: sc,
    applySearch,
  };

  return res;
}
