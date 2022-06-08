import { Button, Card } from 'semantic-ui-react'; // , Header, Divider
import { Icon, Term } from '@eeacms/search/components';
import cx from 'classnames';
import { useSearchContext } from '@eeacms/search/lib/hocs';
import { useFilterState } from '@eeacms/search/state';

import { getFilterValueDisplay } from './utils';

const SortedOptions = (props) => {
  const { sortedOptions, onRemove, onSelect, iconsFamily, field } = props;

  const searchContext = useSearchContext();
  const { filters = [] } = searchContext;

  const initialValue =
    (filters.find((f) => f.field === field) || {})?.values || [];

  const [state, dispatch] = useFilterState(
    field,
    !initialValue
      ? []
      : Array.isArray(initialValue)
      ? initialValue
      : [initialValue],
  );

  return (
    <>
      {initialValue.length > 0 ? (
        <>
          <div className="facet-list-header">
            <div class="modal-section-title">
              Active filters
              {filters.map((filter, index) => {
                return filter.field === field ? (
                  <>
                    <span key={index}> ({filter.values.length})</span>
                  </>
                ) : null;
              })}
            </div>
            <Button
              basic
              className="clear-btn"
              content="clear all"
              onClick={() => {
                if (state.length > 0) {
                  dispatch({
                    type: 'reset',
                    value: [],
                    id: 'btn-clear-filters',
                  });
                }
              }}
            />
          </div>
          <div className="facets-wrapper">
            {filters.map((filter, index) => {
              return filter.field === field ? (
                <>
                  {filter.values.map((option, i) => {
                    return (
                      <Card
                        key={`${getFilterValueDisplay(option)}`}
                        className="term active-term"
                      >
                        <Card.Content>
                          <Card.Header className="card-header">
                            {iconsFamily && (
                              <Icon
                                family={iconsFamily}
                                type={option.value}
                                className="facet-option-icon"
                              />
                            )}

                            <Term term={option} field={field} />
                            {/*<Button
                            className="clear-filters"
                            size="mini"
                            onClick={() => {}}
                          >
                            <Icon name="close" role="button" />
                          </Button>*/}
                          </Card.Header>
                        </Card.Content>
                      </Card>
                    );
                  })}
                </>
              ) : null;
            })}
          </div>
        </>
      ) : null}

      <div class="modal-section-title">Add more filters</div>
      <Card.Group itemsPerRow={5}>
        {sortedOptions.map((option, i) => {
          const checked = option.selected;
          return (
            <Card
              key={`${getFilterValueDisplay(option.value)}`}
              onClick={() =>
                checked ? onRemove(option.value) : onSelect(option.value)
              }
              className={cx('term', { active: checked })}
            >
              <Card.Content>
                <Card.Header>
                  {iconsFamily && (
                    <Icon
                      family={iconsFamily}
                      type={option.value}
                      className="facet-option-icon"
                    />
                  )}

                  <Term term={option.value} field={field} />
                </Card.Header>
              </Card.Content>
              <Card.Content extra>
                <span className="count">
                  ({option.count.toLocaleString('en')})
                </span>
              </Card.Content>
            </Card>
          );
        })}
      </Card.Group>
    </>
  );
};

export default SortedOptions;
