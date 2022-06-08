import React from 'react';
import { useAppConfig } from '@eeacms/search/lib/hocs';
import { Component } from '@eeacms/search/components';
import { useSearchContext } from '@eeacms/search/lib/hocs';
import { Modal, Button, Icon, Card } from 'semantic-ui-react';
import { useAtom } from 'jotai';
import { selectedFiltersAtom } from './state';

const Facet = ({ info, defaultWrapper, filters, selectedFilters }) => {
  const { factory, wrapper } = info;

  // const facet = registry.resolve[factory];
  const FacetWrapperComponent = wrapper ? Component : defaultWrapper;
  const props = {
    ...info,
    ...info.params,
    // ...facet,
  };
  const { field } = info;
  const Facet = React.useCallback(
    (props) => <Component factoryName={factory} {...props} field={field} />,
    [factory, field],
  );

  return (
    <>
      {selectedFilters.map((filter, i) => {
        return info.field === filter ? (
          <FacetWrapperComponent
            factoryName={wrapper}
            {...props}
            field={info.field}
            view={Facet}
            key={i}
          />
        ) : null;
      })}
    </>
  );
};

const FacetsList = ({ view, defaultWrapper }) => {
  const { appConfig } = useAppConfig();
  const { facets = [] } = appConfig;
  const ViewComponent = view || Component;

  const searchContext = useSearchContext();
  const { filters = [], clearFilters } = searchContext;

  const [isOpened, setIsOpened] = React.useState();
  const filterValues = filters.map((f) => f.field);
  const [selectedFilters, setSelectedFilters] = useAtom(selectedFiltersAtom);

  React.useEffect(() => {
    const activeFilters = [...new Set([...selectedFilters, ...filterValues])];
    setSelectedFilters(activeFilters);
    //eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="facet-list-header">
        <h4>Filter Results</h4>
        <Button
          basic
          className="clear-btn"
          content="clear all filters"
          onClick={() => {
            clearFilters();
          }}
        />
      </div>
      <ViewComponent name="DefaultFacetsList">
        <>
          {facets
            .filter((f) => f.showInFacetsList)
            .map((info, i) => (
              <Facet
                info={info}
                filters={filters}
                selectedFilters={selectedFilters}
                key={i}
                defaultWrapper={defaultWrapper}
              />
            ))}
        </>

        <Modal
          className="filters-modal"
          onClose={() => setIsOpened(false)}
          onOpen={() => setIsOpened(true)}
          open={isOpened}
          trigger={<Button className="facet">+ Add filters</Button>}
        >
          <Modal.Header>Add filters</Modal.Header>
          <Modal.Content>
            <div className="modal-content-section">
              <div className="modal-section-title">
                Active filters ({selectedFilters.length})
              </div>
              <div className="facets-wrapper">
                {facets
                  .filter((facet) => selectedFilters.includes(facet.field))
                  .filter((facet) => facet.label.trim() !== '')
                  .map((facet, i) => (
                    <Card
                      key={i}
                      header={
                        <div className="card-header">
                          <span className="text" title={facet.label}>
                            {facet.label}
                          </span>
                          <Button
                            className="clear-filters"
                            size="mini"
                            onClick={() => {
                              let filterValuesBtn = selectedFilters.filter(
                                (l) => l !== facet.field,
                              );
                              setSelectedFilters(filterValuesBtn);
                            }}
                          >
                            <Icon name="close" role="button" />
                          </Button>
                        </div>
                      }
                      className="facet"
                      onClick={() => {}}
                    />
                  ))}
              </div>
            </div>
            <div className="modal-content-section">
              <div className="modal-section-title">Add more filters</div>
              <div className="filter-buttons">
                {facets
                  .filter((facet) => facet.showInFacetsList)
                  .filter((facet) => !selectedFilters.includes(facet.field))
                  .map((facet, i) => (
                    <>
                      <Button
                        className="add-filter"
                        key={i}
                        onClick={() => {
                          setSelectedFilters([...selectedFilters, facet.field]);
                        }}
                      >
                        {facet.label}
                      </Button>
                    </>
                  ))}
              </div>
            </div>
          </Modal.Content>
          <Modal.Actions>
            <Button
              content="Close"
              onClick={() => {
                setIsOpened(false);
              }}
            />
            <Button
              primary
              content="Apply"
              onClick={() => {
                setIsOpened(false);
              }}
            />
          </Modal.Actions>
        </Modal>
      </ViewComponent>
    </>
  );
};

export default FacetsList;
