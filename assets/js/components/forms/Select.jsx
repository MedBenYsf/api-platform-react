import React from 'react';
const Select = (props) => {
	const { name, label, value, onChange, error = '', children } = props;

	return (
		<div className="form-group">
			<label htmlFor={name}>{label}</label>
			<select
				name={name}
				id={name}
				className={'form-control' + (error && ' is-invalid')}
				value={value}
				onChange={onChange}
				error={error}
			>
				{children}
			</select>
			<p className="invalid-feedback">{error}</p>
		</div>
	);
};

export default Select;
