import React, { useMemo, useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Annotation,
} from 'react-simple-maps';
import { Tooltip as ReactTooltip } from 'react-tooltip';

const geoUrl =
  'https://gist.githubusercontent.com/michellechandra/0b2ce4923dc9b5809922/raw/a476b9098ba0244718b496697c5b350460d32f99/us-states.json';

interface USHeatmapProps {
  data: { stateDescription: string; averagePrice: number; stateid: string }[];
  colorScale: (value: number) => string;
}

const USHeatmap: React.FC<USHeatmapProps> = ({ data, colorScale }) => {
  const [tooltipContent, setTooltipContent] = useState('');
  const memoizedData = useMemo(() => data, [data]);

  return (
    <div style={{ width: '100%', height: 'auto' }}>
      <ReactTooltip>{tooltipContent}</ReactTooltip>
      <ComposableMap projection="geoAlbersUsa">
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const stateData = memoizedData.find(
                (d) => d.stateDescription === geo.properties.name
              );
              const fillColor = stateData
                ? colorScale(stateData.averagePrice)
                : '#D6D6DA';
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fillColor}
                  stroke="#FFFFFF"
                  data-tip={`${geo.properties.name} - ${
                    stateData
                      ? `${stateData.averagePrice.toFixed(2)} cents/kWh`
                      : 'No data'
                  }`}
                  style={{
                    default: {
                      outline: 'none',
                    },
                    hover: {
                      outline: 'none',
                      fillOpacity: 0.8,
                    },
                    pressed: {
                      outline: 'none',
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default USHeatmap;
