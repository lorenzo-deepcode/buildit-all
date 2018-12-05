import React from 'react'
import { Field, reduxForm, change } from 'redux-form'
 
const LocationPickerField = ({locations = [], onChange, name="locationId"}) => (
    <Field name={name} component="select" onChange={onChange}>
        {locations.map(location => (
            <option value={location.id} key={location.id}>
                {location.name}
            </option>
        ))}
    </Field>
)

let LocationPicker = (props) => {
    const { handleSubmit, pristine, reset, submitting } = props
    return (
        <form onSubmit={handleSubmit}>
            <LocationPickerField></LocationPickerField>
        </form>
    )
}

LocationPicker = reduxForm({
    form: 'form'  // a unique identifier for this form
})(LocationPicker)

export default LocationPicker