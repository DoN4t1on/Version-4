import React from 'react';

export function AuthField({ id, label, error, ...inputProps }) {
  return (
    <label className='form-field' htmlFor={id}>
      <span className='form-field__label'>{label}</span>
      <input id={id} className='form-field__input' {...inputProps} />
      {error ? <span className='error-color'>{error}</span> : null}
    </label>
  );
}
