import React from 'react';
import { Segment } from 'semantic-ui-react';
import { ModalFacetWrapper } from '@eeacms/search/components';

import FacetsList from './FacetsList';

const TopFacetList = (props) => {
  return (
    <Segment
      className="facetslist-wrapper top-facetslist-wrapper"
      loading={props.isLoading}
    >
      <FacetsList
        defaultWraper={ModalFacetWrapper}
        view={({ children }) => (
          <div className="facets-wrapper">{children}</div>
        )}
      />
    </Segment>
  );
};

export default TopFacetList;
