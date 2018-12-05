import _ from 'lodash';
import React from 'react';
import Radium from 'radium';

export const DEFAULT_SIZE = 24
           , DEFAULT_COLOUR = '#000';

export const determineViewBox = function(viewBox = [ DEFAULT_SIZE, DEFAULT_SIZE ]) {
  if (_(viewBox).isArray() === false) viewBox = [ viewBox ];
  if (viewBox.length === 1) viewBox.push(viewBox[0]);
  return [ 0, 0, viewBox[0], viewBox[1] ].join(' ');
};

export default function(props = {}) {
  const { viewBox
        , defaultLabel
        , defaultColour = DEFAULT_COLOUR
        , defaultSize = DEFAULT_SIZE 
        , defaultWidth
        , defaultHeight
        } = props;

  return function Svg(Component) {

    // eslint-disable-next-line
    return Radium(props => {
      const { style
            , label = defaultLabel
            , size = defaultSize
            , width = defaultWidth
            , height = defaultHeight
            , colour = defaultColour
            , onClick = _ => {}
            } = props;

      const styles = {
        base: {
          width: width || size
        , height: height || size
        , verticalAlign: 'middle'
        , fill: colour
        }
      };

      return (
        <svg className={props.className} aria-label={label} style={[ styles.base, style ]} data-test={props['data-test']} 
             viewBox={determineViewBox(viewBox)} width={0} height={0} onClick={onClick}>
          <Component {...props} />
        </svg>
      );
    });
  };
};
