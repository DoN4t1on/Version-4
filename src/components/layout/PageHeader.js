import React from 'react';
import { useNavigate } from 'react-router-dom';

export function PageHeader({ title, onBack, rightAction = null, showBack = true }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    navigate(-1);
  };

  return (
    <header className='page-header'>
      <div className='page-header__side'>
        {showBack ? (
          <button
            type='button'
            className='page-header__back'
            onClick={handleBack}
            aria-label='Back'
          >
            <img
              className='page-header__back-icon'
              src={require('../../img/arrow-left-short.svg')}
              alt=''
            />
          </button>
        ) : null}
      </div>
      <h1 className='page-header__title'>{title}</h1>
      <div className='page-header__action'>{rightAction}</div>
    </header>
  );
}
