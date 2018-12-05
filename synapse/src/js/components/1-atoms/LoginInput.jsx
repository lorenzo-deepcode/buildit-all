import React, { PropTypes } from 'react';

const defaultValue = '';

const LoginInput = ({
  label,
  property,
  onInputChange,
  initialValue = defaultValue,
  disabled = false,
  type = 'text',
}) => {
  let input;
  return (
    <div className="form-group">
      <label htmlFor={`${property}`}>{label}</label>
      <input
        disabled={disabled}
        className="form-control"
        type={type}
        id={`${property}`}
        placeholder={label}
        ref={node => {
          input = node;
          if (input) {
            if (!input.value) {
              input.value = initialValue ? initialValue.toString() : defaultValue;
            }
          }
        }
      }
        onChange={() => {
          onInputChange(property, input.value);
        }
      }
      />
    </div>
  );
};

export default LoginInput;

LoginInput.propTypes = {
  section: PropTypes.string,
  property: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  initialValue: PropTypes.string,
  onInputChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
