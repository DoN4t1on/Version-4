import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import {
  FacebookIcon,
  LinkedinIcon,
  RedditIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
} from 'react-share';
import { baseUrl } from '../config/config';

export function ShareLinks({ url }) {
  const { t } = useTranslation();
  const fullUrl = baseUrl + (url || '');

  return (
    <>
      <button
        type='button'
        className='btn btn-success button share-copy-btn'
        onClick={() => {
          navigator.clipboard.writeText(fullUrl);
          toast.success(t('toast.linkCopied'));
        }}
      >
        {t('share.copyLink')} <img src={require('../img/link-white.svg')} alt='' />
      </button>

      <div className='share-grid'>
        <a href={`https://twitter.com/share?url=${fullUrl}`} target='_blank' rel='noreferrer'>
          <TwitterIcon size={56} round className='share-icon' />
        </a>
        <a href={`whatsapp://send?text=${fullUrl}`} data-action='share/whatsapp/share'>
          <WhatsappIcon size={56} round className='share-icon' />
        </a>
        <a href={`https://t.me/share/url?url=${fullUrl}`}>
          <TelegramIcon size={56} round className='share-icon' />
        </a>
        <a
          href={`https://www.linkedin.com/shareArticle?url=${fullUrl}&title=Lokalspende`}
          target='_blank'
          rel='noreferrer'
        >
          <LinkedinIcon className='share-icon' size={56} round />
        </a>
        <a
          href={`https://reddit.com/submit?url=${fullUrl}&title=Lokalspende`}
          target='_blank'
          rel='noreferrer'
        >
          <RedditIcon className='share-icon' size={56} round />
        </a>
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${fullUrl}`} target='_blank' rel='noreferrer'>
          <FacebookIcon className='share-icon' size={56} round />
        </a>
      </div>

      {typeof navigator !== 'undefined' && navigator.share ? (
        <button
          type='button'
          className='btn btn-success button button--ghost share-sheet__native'
          onClick={() => {
            navigator.share({ url: fullUrl }).catch(() => {});
          }}
        >
          {t('share.systemShare')}
        </button>
      ) : null}
    </>
  );
}

export function ShareSheet({ open, onClose, url }) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className='share-sheet' role='dialog' aria-modal='true' aria-label={t('pages.share')}>
      <button type='button' className='share-sheet__backdrop' onClick={onClose} aria-label='×' />
      <div className='share-sheet__panel'>
        <div className='share-sheet__handle' />
        <div className='share-sheet__header'>
          <p className='share-sheet__title'>{t('pages.share')}</p>
          <button type='button' className='share-sheet__close' onClick={onClose} aria-label='×'>
            ×
          </button>
        </div>
        <ShareLinks url={url} />
      </div>
    </div>
  );
}
