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

const filterActions = ['removeFilter', 'setFilter', 'addFilter'];

const buildDriver = (searchContext, onSearchTrigger, onTouchFilter) => {
  const initialState = Object.assign(
    {},
    ...stateFields.map((k) => ({ [k]: searchContext[k] })),
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
let dirtyFilters = [];

export default function useProxiedSearchContext(searchContext) {
  const [driver, setDriver] = useAtom(driverAtom);
  const [, setSerial] = React.useState();

  React.useEffect(() => {
    const driver = buildDriver(searchContext, () => setSerial(new Date()));
    Object.entries(driver.actions).forEach(([name, action]) => {
      const func_name = `handle_${name}`;
      const wrapper = {
        // a dynamic function name, for better debugging
        [func_name]: function () {
          const filter = { field: arguments[0], type: arguments[2] };
          dirtyFilters = Array.from(new Set([...dirtyFilters, filter]));
          return action.apply(driver, arguments);
        },
      };
      driver[name] = wrapper[func_name];
    });
    setDriver(driver);
  }, [searchContext, setDriver]); // dirtyFilters, setDirtyFilters

  const applySearch = React.useCallback(() => {
    // searchContext.reset();
    // searchContext.setCurrent(driver.state.current);
    // searchContext.setSort(driver.state.sortField, driver.state.sortDirection);
    // searchContext.setResultsPerPage(driver.state.resultsPerPage);
    // searchContext.setSearchTerm(driver.state.searchTerm);
    // console.log(driver.state.filters, driver.filters);
    dirtyFilters.forEach(({ field, type }) => {
      // console.log('remove filter', field, type);
      searchContext.removeFilter(field, null, type);
    });
    driver.state.filters.forEach((f) => {
      // searchContext.setFilter(f.field, f.values[0], f.type),
      searchContext.removeFilter(f.field, null, f.type);
      searchContext.addFilter(f.field, f.values, f.type);
    });
  }, [searchContext, driver]);

  const sc = driver ? getSearchContext(driver) : searchContext;
  if (driver) {
    // this is updated async. The state update with Date is used to force refresh
    sc.facets = searchContext.facets;
  }

  const res = {
    searchContext: sc,
    applySearch,
  };

  return res;
}
