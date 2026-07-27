import React, { useEffect } from 'react';

export function AuthModal({ open, onClose, title, children, footer = null }) {
  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className='auth-modal' role='dialog' aria-modal='true' aria-labelledby='auth-modal-title'>
      <button type='button' className='auth-modal__backdrop' onClick={onClose} aria-label='Close' />
      <div className='auth-modal__panel'>
        <div className='auth-modal__header'>
          <h2 id='auth-modal-title' className='auth-modal__title'>{title}</h2>
          <button type='button' className='auth-modal__close' onClick={onClose} aria-label='Close'>
            ×
          </button>
        </div>
        <div className='auth-modal__body'>{children}</div>
        {footer ? <div className='auth-modal__footer'>{footer}</div> : null}
      </div>
    </div>
  );
}
