import React from 'react'

const StandardInput = ({label='Event Name', type='text'}) => (
    <div className="standardInput">    
        <label id={label.replace(/\s/g, '-').toLowerCase()}>{label}</label>
            <div>
              <input placeholder={label} type={type} />
            </div>
    </div>
)

export default StandardInput
