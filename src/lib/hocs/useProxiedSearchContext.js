import React from 'react';
import isFunction from 'lodash.isfunction';
import { SearchDriver } from '@elastic/search-ui';

const stateFields = [
  'current',
  'filters',
  'resultsPerPage',
  'searchTerm',
  'sortDirection',
  'sortField',
  'sortList',
];

const buildDriver = (initialState) => {
  const driver = new SearchDriver({
    debug: true,
    initialState,
    trackUrlState: false,
    onSearch: () =>
      new Promise(() => {
        console.log('onsearch fake');
      }),
  });

  driver.isReplacementSearchContext = true;
  return driver;
};

export default function useProxiedSearchContext(searchContext) {
  const initialState = Object.assign(
    {},
    stateFields.map((k) => ({ [k]: searchContext[k] })),
  );
  const [driver] = React.useState(buildDriver(initialState));

  // console.log('driver', driver);

  const doSearch = React.useCallback(() => {
    searchContext.reset();
    searchContext.setCurrent(driver.state.current);
    searchContext.setSort(driver.state.sortField, driver.state.sortDirection);
    searchContext.setResultsPerPage(driver.state.resultsPerPage);
    searchContext.setSearchTerm(driver.state.searchTerm);
    driver.state.filters.forEach((f) => searchContext.setFilter(f));
  }, [searchContext, driver.state]);

  function debug(func_name, func) {
    function helper() {
      console.log('helper', func_name, arguments);
      const res = func.apply(driver, arguments);
      console.log('new state', driver.state);
      return res;
    }
    helper.bind(driver);
    return helper;
  }

  const newSearchContext = Object.entries(searchContext).reduce(
    (acc, [k, v]) => {
      acc[k] = isFunction(v) ? debug(k, v) : v;
      // isFunction(v) ? { ...acc, [k]: debug(v) } : { ...acc, [k]: v };
      // console.log('v', v, isFunction(v));
      return acc;
    },
    driver,
  );
  newSearchContext.driver = driver;
  newSearchContext.debug = true;
  console.log('new searchContext', newSearchContext);

  return {
    searchContext: newSearchContext,
    filters: searchContext.filters,
    doSearch,
  };
}
