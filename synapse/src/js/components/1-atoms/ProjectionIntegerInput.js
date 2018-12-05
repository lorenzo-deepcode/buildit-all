import React, { PropTypes } from 'react';

const isAnyDigit = new RegExp('[0-9]');

const validateInput = input => {
  if (!isAnyDigit.test(input)) return 0;
  return input;
};

const ProjectionIntegerInput = (
  { label,
    legendClass,
    onInputChange,
    initialValue,
    unit }) => {
  let input;
  return (
    <div className="projection-integer-input form-group">
      <div>
        <span className={`legend ${legendClass}`}></span>
        <label>
          <span className="slider-label">{label}</span>
        </label>
      </div>

      <div className="input">
        <div>
          <span className="unit">{unit}</span>
        </div>
        <input
          type="number"
          value={initialValue}
          ref={node => { input = node; }}
          onChange={() => {
            const validValue = validateInput(input.value);
            onInputChange(validValue);
          }
        }
        />
      </div>

    </div>
  );
};

export default ProjectionIntegerInput;

ProjectionIntegerInput.propTypes = {
  label: PropTypes.string.isRequired,
  legendClass: PropTypes.string,
  unit: PropTypes.string,
  initialValue: PropTypes.number.isRequired,
  onInputChange: PropTypes.func.isRequired,
};
