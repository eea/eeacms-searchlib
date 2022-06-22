import {
  getDefaultFilterValues,
  normalizeFilters,
  deepEqual,
} from '@eeacms/search/lib/utils';

export const checkInteracted = ({
  filters,
  searchTerm,
  appConfig,
  wasSearched,
}) => {
  // console.log('configured facets', appConfig.facets);
  const normalizedDefaultFilters = getDefaultFilterValues(appConfig.facets);

  const normalizedFilters = normalizeFilters(filters);

  const filtersAreDefault = deepEqual(
    normalizedDefaultFilters,
    normalizedFilters,
  );
  const filtersAreNotDefault = !filtersAreDefault;

  const hasFilters = filters.length === 0;

  console.log('normalizedFilters', {
    normalizedFilters,
    normalizedDefaultFilters,
    filtersAreDefault,
    filters,
  });

  return wasSearched;

  // return wasSearched
  //   ? searchTerm || filtersAreNotDefault
  //   : searchTerm || !(hasFilters || filtersAreDefault);
};
