import React, { PropTypes } from 'react';

const ProjectionSlider = ({ label, legendClass, onInputChange, initialValue, min, max, unit }) => {
  let input;
  return (
    <div className="projection-slider form-group">
      <div>
        <span className={`legend ${legendClass}`}></span>
        <label>
          <span className="slider-label">{label}</span>
        </label>
      </div>

      <div className="slider">
        <input
          type="range"
          min={min}
          max={max}
          value={initialValue}
          ref={node => { input = node; }}
          onChange={() => {
            onInputChange(input.value);
          }
        }
        />
        <div>
          <span className="value">{initialValue}</span>
          <span className="unit">{unit}</span>
        </div>
      </div>

    </div>
  );
};

export default ProjectionSlider;

ProjectionSlider.propTypes = {
  label: PropTypes.string.isRequired,
  legendClass: PropTypes.string,
  unit: PropTypes.string,
  initialValue: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onInputChange: PropTypes.func.isRequired,
};
