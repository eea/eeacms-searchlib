import React from 'react';
import { useSearchContext, useAppConfig } from '@eeacms/search/lib/hocs';
import { Icon, List, Accordion } from 'semantic-ui-react';
import { isLandingPageAtom } from '@eeacms/search/state';
import { useAtom } from 'jotai';

function toArray(s) {
  let a = [];
  if (typeof s === 'string') {
    a = (s || '').split('\n').filter((n) => !!n.trim());
  } else if (Array.isArray(s)) {
    a = s;
  }
  return a;
}

export default function SampleQueryPrompt() {
  const { appConfig } = useAppConfig();
  const { setSearchTerm, setSort, resetFilters } = useSearchContext();
  const [isLandingPage] = useAtom(isLandingPageAtom);

  const {
    defaultPromptQueries = [],
    promptQueries,
    // promptQueryInterval = 10000,
  } = appConfig;

  const pqa = toArray(promptQueries);
  const dpqa = toArray(defaultPromptQueries);

  const queries = pqa.length ? pqa : dpqa.length ? dpqa : [];

  // const nrQueries = queries.length;

  // const randomizer = React.useCallback(
  //   () => Math.max(Math.ceil(Math.random() * nrQueries) - 1, 0),
  //   [nrQueries],
  // );
  // const [index, setIndex] = React.useState(randomizer());
  // const [paused, setPaused] = React.useState(false);
  // const timerRef = React.useRef();

  // React.useEffect(() => {
  //   timerRef.current = setInterval(() => {
  //     const next = randomizer();
  //     if (!paused) setIndex(next);
  //   }, promptQueryInterval);
  //   return () => clearInterval(timerRef.current);
  // }, [paused, promptQueryInterval, randomizer]);

  const applyQuery = React.useCallback(
    (text) => {
      resetFilters();
      setSearchTerm(text, { shouldClearFilters: false });
      setSort('', '');
    },
    [resetFilters, setSearchTerm, setSort],
  );

  const [activeIndex, setActiveIndex] = React.useState([]);

  const toggleOpenAccordion = (e, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setActiveIndex((activeIndex) => (activeIndex = newIndex));
  };

  return isLandingPage && queries.length ? (
    <div className="demo-question">
      <h4>Try our suggestions</h4>
      {/*<Button
        as="a"
        basic
        onMouseOver={() => setPaused(true)}
        onMouseOut={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onClick={(evt) => {
          evt.preventDefault();
          // setTriedDemoQuestion(true);
          applyQuery(queries[index]);
        }}
        key={queries[index]}
      >
        {queries[index]}
      </Button>*/}

      <List>
        {queries
          .filter((i, index) => index < 3)
          .map((text, i) => (
            <List.Item
              key={i}
              as="a"
              onClick={() => {
                applyQuery(text);
              }}
              onKeyDown={() => {
                applyQuery(text);
              }}
            >
              {text}
            </List.Item>
          ))}
      </List>

      <Accordion className="suggestion-accordion">
        <Accordion.Title
          active={activeIndex === 0}
          index={0}
          onClick={toggleOpenAccordion}
        >
          <div className="accordion-title-wrapper">
            More
            <Icon className="ri-arrow-down-s-line" />
          </div>
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          <List>
            {queries
              .filter((i, index) => index > 3)
              .map((text, i) => (
                <List.Item
                  key={i}
                  as="a"
                  onClick={() => {
                    applyQuery(text);
                  }}
                  onKeyDown={() => {
                    applyQuery(text);
                  }}
                >
                  {text}
                </List.Item>
              ))}
          </List>
        </Accordion.Content>
      </Accordion>
    </div>
  ) : null;
}
