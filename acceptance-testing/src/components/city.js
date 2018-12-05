import React from 'react';
import { reduxForm } from 'redux-form';

export const City = ({ fields, handleSubmit }) => {
  const styles={
    base: {
      border: 'none'
    , marginLeft: 5
    , fontSize: '1em'
    , fontWeight: 400
    , outline: 'none'
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{display:'inline'}}>
      <input value={fields.city.value || ''} onChange={fields.city.onChange} name='city' id='city'
             type='text' placeholder='city' style={styles.base} data-test='city' />
    </form>
  );
};

export default reduxForm({ form: 'city', fields: [ 'city' ] })(City);
