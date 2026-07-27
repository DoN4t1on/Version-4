import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageShell } from './components/layout/PageShell';

export const Donators = () => {
  const { t } = useTranslation();

  return (
    <PageShell title={t('pages.donations')} showBack={false}>
      <p className='supporter-list'>
        <Link to='/profil' className='linkblack'>
          <img src={require('./img/profile.png')} className='supporter-list-image' alt='' /> (Name)
        </Link>{' '}
        - (Betrag) <span className='time-supported'>(Zeit)</span>
      </p>
      <p className='supporter-list anonymous-support'>
        Anonym - (Betrag) <span className='time-supported'>(Zeit)</span>
      </p>
      <p className='supporter-list'>
        <img
          src={require('./img/profile.png')}
          style={{ visibility: 'hidden' }}
          className='supporter-list-image'
          alt=''
        />
        <Link to='/profil' className='linkblack'>
          {' '}
          (Name)
        </Link>{' '}
        - (Betrag) <span className='time-supported'>(Zeit)</span>
      </p>
    </PageShell>
  );
};
