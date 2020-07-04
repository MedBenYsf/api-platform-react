import React from 'react'
const Field = (props) => {
    const {name, label, type, value, handleChange, placeholder='', error=''} = props;

    return ( <div className="form-group">
    <label htmlFor={name}>{label} </label>
    <input
        value={value}
        onChange={handleChange}
        type={type}
        className={'form-control' + (error && ' is-invalid')}
        id={name}
        name={name}
        placeholder={placeholder || label}
    />
    {error && <div className="invalid-feedback">{error}</div>}
</div> );
}
 
export default Field;