import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { localStorageData } from './services/auth/localStorageData';
import { toast } from 'react-toastify';
import { getNavActiveState } from './components/layout/navState';

function navItemClass(isActive) {
  return `nav__link ${isActive ? 'under-navitem-selected' : 'under-navitem-unselected'}`;
}

export const NavbarBottom = ({ showInfo = true } = {}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const active = getNavActiveState(pathname);

  const redirectToLogin = () => {
    navigate('/dein-profil', { replace: true });
    toast.error(t('toast.loginRequired'));
  };

  const route = () => {
    if (localStorageData('_id')) {
      navigate('/antrag-erstellen');
    } else {
      redirectToLogin();
    }
  };

  return (
    <div className='bottom-nav-shell'>
      <nav className='nav under-navbar' aria-label='Main navigation'>
        <Link to='/' className={navItemClass(active.home)}>
          <i className='material-icons nav__icon'>home</i>
          <span className='nav__text'>{t('nav.home')}</span>
        </Link>

        <Link to='/suche' className={navItemClass(active.search)}>
          <i className='material-icons nav__icon'>search</i>
          <span className='nav__text'>{t('nav.search')}</span>
        </Link>

        <button type='button' className='nav__link nav__link--create' onClick={route}>
          <span className='nav__create-fab'>
            <i className='material-icons'>add</i>
          </span>
          <span className='nav__text nav__text--create'>{t('suggestions.createButton')}</span>
        </button>

        <Link to='/aktivitat' className={navItemClass(active.activity)}>
          <i className='material-icons nav__icon'>bolt</i>
          <span className='nav__text'>{t('nav.activity')}</span>
        </Link>

        <Link to='/dein-profil' className={navItemClass(active.profile)}>
          <i className='material-icons nav__icon'>person</i>
          <span className='nav__text'>{t('nav.profile')}</span>
        </Link>
      </nav>

      {showInfo ? (
        <Link to='/info' className='bottom-nav-shell__info' aria-label={t('nav.info')}>
          <img src={require('./img/info-circle.svg')} className='info-image' alt='' />
        </Link>
      ) : null}
    </div>
  );
};
