import React from 'react';
import isFunction from 'lodash.isfunction';
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

const buildDriver = (searchContext) => {
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
        console.log('onsearch fake', driver);
      }),
  });

  // Object.entries(searchContext).forEach(([k, v]) => {
  //   driver[k] = isFunction(v) ? driver[k] : v; // debug(k, v)
  // });

  // driver.debug = true;
  driver.isReplacementSearchContext = true;

  return driver;
};

const getSearchContext = (driver) => {
  const searchContext = {
    ...driver.state,
    ...driver,
  };
  console.log('search context', searchContext);
  return searchContext;
};

const driverAtom = atom();

export default function useProxiedSearchContext(searchContext) {
  const [driver, setDriver] = useAtom(driverAtom);

  React.useEffect(() => {
    setDriver(buildDriver(searchContext));
  }, [searchContext, setDriver]);

  const applySearch = React.useCallback(() => {
    // searchContext.reset();
    // searchContext.setCurrent(driver.state.current);
    // searchContext.setSort(driver.state.sortField, driver.state.sortDirection);
    // searchContext.setResultsPerPage(driver.state.resultsPerPage);
    // searchContext.setSearchTerm(driver.state.searchTerm);
    driver.state.filters.forEach((f) => searchContext.setFilter(f));
  }, [searchContext, driver]);

  const sc = driver ? getSearchContext(driver) : searchContext;
  if (driver) {
    sc.facets = searchContext.facets; // this is updated async
  }

  const res = {
    searchContext: sc,
    applySearch,
  };
  console.log('use', res, driver);
  return res;
}

// const [driver] = React.useState(buildDriver(initialState, searchContext));
