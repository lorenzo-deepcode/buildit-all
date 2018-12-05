import React, { PropTypes } from 'react';

const DateInput = ({ label, onInputChange, initialValue = '' }) => {
  let input;
  return (
    <div className="form-group">
      <label>{label}</label>
      <input
        className="form-control"
        type="date"
        placeholder={label}
        value={initialValue}
        ref={node => { input = node; }}
        onChange={() => {
          onInputChange(input.value);
        }
      }
      />
    </div>
  );
};

export default DateInput;

DateInput.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  initialValue: PropTypes.string,
  onInputChange: PropTypes.func.isRequired,
};
