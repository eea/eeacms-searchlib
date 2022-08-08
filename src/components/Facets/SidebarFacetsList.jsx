import React from 'react';
import { Sidebar } from 'semantic-ui-react'; // Button, Radio,
import { useSearchContext, useOutsideClick } from '@eeacms/search/lib/hocs';
import FacetResolver from './FacetResolver';

export default function SidebarFacetsList(props) {
  const {
    onClose,
    open,
    facets,
    // applySearch,
    // isLiveSearch,
    // setIsLiveSearch,
  } = props;
  const nodeRef = React.useRef(null);

  useOutsideClick(nodeRef, onClose);
  const searchContext = useSearchContext();

  return (
    <div ref={nodeRef}>
      <Sidebar
        visible={open}
        animation="overlay"
        icon="labeled"
        width="wide"
        direction="right"
      >
        <div className="sidebar-wrapper">
          <div className="sidebar-content">
            {facets.map((facetInfo, i) => (
              <FacetResolver
                key={i}
                {...searchContext}
                {...facetInfo}
                wrapper="AccordionFacetWrapper"
              />
            ))}
          </div>
          {/* <div className="sidebar-footer">
            {!isLiveSearch && <Button onClick={applySearch}>Apply</Button>}
            <Radio
              toggle
              label="Live search"
              checked={isLiveSearch}
              onChange={(e, { checked }) => setIsLiveSearch(checked)}
            />
          </div> */}
        </div>
      </Sidebar>
    </div>
  );
}
