import React from 'react';
import { Grid } from 'semantic-ui-react';
import { isLandingPageAtom } from '@eeacms/search/state';
import { useAtom } from 'jotai';

const TopFilterLayout = (props) => {
  const { bodyContent, bodyFooter, bodyHeader, header, sideContent } = props;
  const [isLandingPage] = useAtom(isLandingPageAtom);

  return (
    <div className="top-filter-layout">
      <div className="search-header-container">
        <div className="sui-layout-header">
          <div className="sui-layout-header__inner">{header}</div>
        </div>
      </div>

      <div className="body-content">
        {!isLandingPage && <>{sideContent}</>}
        {bodyHeader}
        {bodyContent}
      </div>

      <Grid className="body-footer">
        <Grid.Row>
          <Grid.Column
            widescreen="2"
            tablet="2"
            computer="2"
            className="col-left"
          ></Grid.Column>
          <Grid.Column
            widescreen="8"
            tablet="12"
            computer="10"
            className="col-mid"
          >
            <div>{bodyFooter}</div>
          </Grid.Column>
          <Grid.Column
            only="computer widescreen large screen"
            widescreen="2"
            className="col-right"
          ></Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default TopFilterLayout;
