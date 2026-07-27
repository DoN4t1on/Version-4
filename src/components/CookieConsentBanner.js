import React from 'react';
import CookieConsent from 'react-cookie-consent';
import { useTranslation } from 'react-i18next';

export function CookieConsentBanner() {
  const { t } = useTranslation();

  return (
    <CookieConsent
      location='bottom'
      disableStyles={true}
      cookieName='myAwesomeCookieName3'
      expires={999}
      buttonClasses='btn btn-success btn-lg button btn-cookies'
      containerClasses='container-cookies'
      buttonText={t('cookie.accept')}
      contentClasses='content-cookies'
      overlay
    >
      {t('cookie.message')}{' '}
      <a
        href='https://app.lokalspende.org/datenschutz'
        style={{ color: '#28a745' }}
      >
        {t('cookie.link')}
      </a>{' '}
      {t('cookie.suffix')}
    </CookieConsent>
  );
}
