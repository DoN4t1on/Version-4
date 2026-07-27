import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppPage } from './AppPage';
import { NavbarBottom } from '../../NavbarBottom';

export function ActivitySubNav({
  activeSection = 'suggestions',
  activeTab = 'created',
}) {
  const { t } = useTranslation();

  return (
    <header className='activity-header'>
      <h4 className='headline-activity'>{t('activity.title')}</h4>
      <Link to='/benachrichtigungseinstellungen' className='notification-settings-image-link'>
        <img
          src={require('../../img/notification-settings.svg')}
          className='notification-settings-image'
          alt=''
        />
      </Link>
      <p className='subheader-activity'>
        <Link to='/aktivitat'>{t('activity.notifications')}</Link>
        <br />
        {activeSection === 'suggestions' ? (
          <strong>{t('navTop.suggestions')}</strong>
        ) : (
          <Link to='/antrag-activity'>{t('navTop.suggestions')}</Link>
        )}
        <br />
        {activeSection === 'crowdfunding' ? (
          <strong className='crowdfundingcampaigns-activity'>{t('navTop.crowdfunding')}</strong>
        ) : (
          <Link to='/crowdfunding-aktivitat' className='crowdfundingcampaigns-activity'>
            {t('navTop.crowdfunding')}
          </Link>
        )}
      </p>
      <p className='activity-further-selectors'>
        {activeSection === 'suggestions' ? (
          <>
            {activeTab === 'created' ? (
              <strong>{t('activity.created')}</strong>
            ) : (
              <Link to='/antrag-activity'>{t('activity.created')}</Link>
            )}{' '}
            |{' '}
            {activeTab === 'marked' ? (
              <strong>{t('activity.marked')}</strong>
            ) : (
              <Link to='/antrag-activity-unterstutzt'>{t('activity.marked')}</Link>
            )}
            |{' '}
            {activeTab === 'supported' ? (
              <strong>{t('activity.supported')}</strong>
            ) : (
              <Link to='/antrag-activity-erstellt'>{t('activity.supported')}</Link>
            )}
          </>
        ) : (
          <>
            {activeTab === 'marked' ? (
              <strong>{t('activity.marked')}</strong>
            ) : (
              <Link to='/crowdfunding-aktivitat'>{t('activity.marked')}</Link>
            )}{' '}
            |{' '}
            {activeTab === 'supported' ? (
              <strong>{t('activity.supported')}</strong>
            ) : (
              <Link to='/antrag-activitat-unterstutzt'>{t('activity.supported')}</Link>
            )}
          </>
        )}
      </p>
    </header>
  );
}

export function ActivityPage({ activeSection, activeTab, children = null }) {
  return (
    <AppPage>
      <ActivitySubNav activeSection={activeSection} activeTab={activeTab} />
      {children}
      <NavbarBottom />
    </AppPage>
  );
}
