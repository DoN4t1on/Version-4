import React from 'react';
import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language?.startsWith('de') ? 'de' : 'en';

  const setLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  return (
    <div className='language-switcher'>
      <p className='language-switcher-label'>
        <strong>{t('language.label')}</strong>
      </p>
      <div className='language-switcher-buttons'>
        <button
          type='button'
          className={`btn btn-success btn-lg button ${currentLanguage === 'de' ? 'border-black' : ''}`}
          onClick={() => setLanguage('de')}
        >
          {t('language.de')}
        </button>
        <button
          type='button'
          className={`btn btn-success btn-lg button ${currentLanguage === 'en' ? 'border-black' : ''}`}
          onClick={() => setLanguage('en')}
        >
          {t('language.en')}
        </button>
      </div>
    </div>
  );
}
