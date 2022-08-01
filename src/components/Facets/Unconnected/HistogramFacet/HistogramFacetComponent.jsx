import React from 'react';
import { getRangeStartEnd } from '@eeacms/search/lib/utils';
import { Input } from 'semantic-ui-react';
import { HistogramSlider } from '@eeacms/search/components/Vis';

const visualStyle = {
  selectedColor: '#55cee4',
  unselectedColor: '#e8e8e8',
  trackColor: '#00548a',
};

const HistogramFacetComponent = (props) => {
  const { data, ranges, onChange, selection, step } = props;

  const range = getRangeStartEnd(ranges);
  const {
    start = selection ? selection[0] : undefined ?? range.start,
    end = selection ? selection[1] : undefined ?? range.end,
  } = props;

  return (
    <div className="histogram-facet">
      <div className="text-input">
        <Input
          type="number"
          value={start}
          onChange={(e, { value }) =>
            onChange({ from: value, to: selection?.[1] })
          }
          min={range.start}
          max={range.end}
          step={step}
          disabled
        />
        <Input
          type="number"
          value={end}
          onChange={(e, { value }) =>
            onChange({ from: selection?.[0], to: value })
          }
          min={range.start}
          max={range.end}
          step={step}
          disabled
        />
      </div>

      <HistogramSlider
        data={data.map((d) => ({
          x0: d.value.from,
          x: d.value.to,
          y: d.count,
        }))}
        {...visualStyle}
        selection={[start, end]}
        onChange={(range) => onChange({ from: range[0], to: range[1] })}
      />
    </div>
  );
};

export default HistogramFacetComponent;
