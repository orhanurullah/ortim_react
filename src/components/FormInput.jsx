import React from 'react';

const FormInput = ({ label, type, name, value, onChange }) => {
    return (
        <div className="mb-3">
            <label>{label}</label>
            <input
                type={type}
                name={name}
                className="form-control"
                value={value}
                onChange={onChange}
                required
            />
        </div>
    );
}

export default FormInput;
