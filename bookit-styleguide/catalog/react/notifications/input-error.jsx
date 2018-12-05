import React from 'react'

const InputError = ({label='Event Name', type='text'}) => (
    <div className="errorInput">    
        <label id={label.replace(/\s/g, '-').toLowerCase()}>{label}</label>
            <div>
              <input placeholder={label} type={type} />              
            </div>
        <span className="errortext">Required Field</span>
    </div>
)

export default InputError


