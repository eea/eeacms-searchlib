import React from 'react';
import { Sidebar } from 'semantic-ui-react';
import { useSearchContext, useOutsideClick } from '@eeacms/search/lib/hocs';
import FacetResolver from './FacetResolver';

export default function SidebarFacetsList(props) {
  const { onClose, open, facets, applySearch } = props;
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
        <div className="sidebar-content">
          {facets.map((facetInfo, i) => (
            <FacetResolver
              key={i}
              {...searchContext}
              {...facetInfo}
              wrapper="AccordionFacetWrapper"
            />
          ))}
          <button onClick={applySearch}>Do search</button>
        </div>
      </Sidebar>
    </div>
  );
}
