import { NavbarBottom } from './NavbarBottom';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { localStorageData, Logout } from './services/auth/localStorageData';
import { useNavigate } from 'react-router-dom';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { PageHeader } from './components/layout/PageHeader';
import { AppPage } from './components/layout/AppPage';

export const Settings = () => {
  const { t } = useTranslation();
  let navigate = useNavigate();
  return (
    <AppPage>
      <PageHeader title={t('settings.title')} />

      <div className='casual-menu'>
        <LanguageSwitcher />

        <p className='settings-section-title'>{t('settings.title')}</p>

        <div className='settings-list'>
          {[
            { href: 'https://lokalspende.org/warteliste/', icon: 'pending_actions', label: t('settings.regionWaitlist') },
            { href: 'https://Lokalspende.org/fragen/', icon: 'help_outline', label: t('settings.questions') },
            { href: 'https://Lokalspende.org/kontakt/', icon: 'mail_outline', label: t('settings.contact') },
            { href: 'https://t.me/LocalDonation', icon: 'forum', label: t('settings.discussionGroup') },
            { href: 'https://github.com/LocalDonation-Dev', icon: 'code', label: t('settings.code') },
            { href: 'https://lokalspende.org/merchandise/', icon: 'storefront', label: t('settings.merchandise') },
            { href: 'https://donorbox.org/localdonation', icon: 'volunteer_activism', label: t('settings.donateToUs') },
          ].map((item) => (
            <a key={item.href} href={item.href} className='settings-list__item'>
              <span className='settings-list__label'>
                <i className='material-icons'>{item.icon}</i>
                {item.label}
              </span>
              <i className='material-icons settings-list__chevron'>chevron_right</i>
            </a>
          ))}
        </div>

        {localStorageData('_id') ? (
          <div className='settings-logout'>
            <button
              className='btn btn-success btn-lg button'
              type='button'
              onClick={() => {
                Logout();
                navigate('/');
              }}
            >
              {t('settings.logout')}
            </button>
          </div>
        ) : null}

        <div className='settings-footer-links'>
          <Link to='/impressum'>{t('settings.imprint')}</Link>
          <Link to='/datenschutz'>{t('settings.privacy')}</Link>
        </div>
      </div>

      <NavbarBottom
        classstart='under-navitem-unselected'
        classsearch='under-navitem-unselected'
        classactivity='under-navitem-unselected'
        classprofile='under-navitem-unselected'
      />
    </AppPage>
  );
};
