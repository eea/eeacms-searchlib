import React from 'react';
// import PagingPrevNext from './../PagingInfo/PagingPrevNext';
// import { PagingInfo as SUIPagingInfo } from '@elastic/react-search-ui';
import { Button } from 'semantic-ui-react';
import { useSearchContext } from '@eeacms/search/lib/hocs';
import cx from 'classnames';

const range = (start, end) => {
  let length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

function Paging({ className, onChange, ...rest }) {
  const searchContext = useSearchContext();
  const {
    current,
    setCurrent,
    totalPages,
    totalResults,
    resultsPerPage,
  } = searchContext;

  const goToNext = () => {
    setCurrent(current + 1);
  };

  const goToPrev = () => {
    setCurrent(current - 1);
  };

  const paginationRange = React.useMemo(() => {
    const siblingCount = 2;
    const totalPageCount = Math.ceil(totalResults / resultsPerPage);
    const leftSiblingIndex = Math.max(current - siblingCount, 1);
    const rightSiblingIndex = Math.min(current + siblingCount, totalPageCount);
    const paginationRange = range(leftSiblingIndex, rightSiblingIndex);

    return paginationRange;
  }, [totalResults, resultsPerPage, current]);

  return (
    <div className="paging-wrapper">
      {current > 1 ? (
        <>
          <Button
            onClick={() => setCurrent(1)}
            className="prev double-angle"
            title="First page"
          />
          <Button
            onClick={() => goToPrev()}
            className="prev single-angle"
            title="Previous page"
          />
        </>
      ) : null}

      {/*<SUIPagingInfo view={PagingPrevNext} />*/}

      {paginationRange.map((pageNumber, index) => {
        return (
          <Button
            key={index}
            className={cx('pagination-item', {
              active: pageNumber === current,
            })}
            onClick={() => setCurrent(pageNumber)}
          >
            {pageNumber}
          </Button>
        );
      })}

      {current < totalPages ? (
        <>
          <Button
            onClick={() => goToNext()}
            className="next single-angle"
            title="Next page"
          />
          <Button
            onClick={() => setCurrent(totalPages)}
            className="next double-angle"
            title="Last page"
          />
        </>
      ) : null}
    </div>
  );
}

export default Paging;
