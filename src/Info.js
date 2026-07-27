import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageShell } from './components/layout/PageShell';

export const Info = () => {
  const { t } = useTranslation();

  return (
    <PageShell title={t('nav.info')} showBack={false}>
      <div className='settings-list'>
        <Link to='/impressum' className='settings-list__item'>
          <span className='settings-list__label'>
            <i className='material-icons'>gavel</i>
            {t('settings.imprint')}
          </span>
          <i className='material-icons settings-list__chevron'>chevron_right</i>
        </Link>
        <Link to='/datenschutz' className='settings-list__item'>
          <span className='settings-list__label'>
            <i className='material-icons'>privacy_tip</i>
            {t('settings.privacy')}
          </span>
          <i className='material-icons settings-list__chevron'>chevron_right</i>
        </Link>
      </div>
    </PageShell>
  );
};
