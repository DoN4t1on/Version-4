import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export const NavbarTop = (props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { locationName } = useSelector((state) => state.Geo);
  const displayLocation = locationName || 'Köln';

  const tabClass = (isActive) =>
    isActive ? 'tab-bar-selected' : 'tab-bar-unselected';

  const isCrowdfunding = pathname.startsWith('/crowdfunding');
  const isAccepted = pathname.includes('/antrage-akzeptiert');
  const isRejected = pathname.includes('/antrage-abgelehnt');
  const isActiveSection = !isCrowdfunding && !isAccepted && !isRejected;
  const isMostPopular = pathname.includes('beliebtesten');

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter') {
      navigate('/suche');
    }
  };

  return (
    <header id='header' className='app-header'>
      <div className='header-row app-header__brand-row'>
        <img
          className='app-header__logo'
          src={require('./img/localsuggestion_icon.svg')}
          alt=''
        />
        <div className='app-header__brand-copy'>
          <p className='app-header__brand-name'>LOKALESPENDE</p>
          <p className='app-header__location'>
            <img
              className='location-icon'
              src={require('./img/geo-alt-fill.svg')}
              alt=''
            />
            {displayLocation}
          </p>
        </div>
      </div>

      <h1 className='app-header__tagline'>{t('navTop.tagline')}</h1>

      <div className='app-header__search-wrap'>
        <input
          className='header-search-input'
          placeholder={t('navTop.searchPlaceholder')}
          onKeyDown={handleSearchKeyDown}
          onClick={() => navigate('/suche')}
          readOnly
        />
      </div>

      <div className='filters app-header__filters'>
        <nav className='tab-bar-menu small-headlines' aria-label='Main sections'>
          <Link to='/' className={tabClass(!isCrowdfunding)}>
            {t('navTop.suggestions')}
          </Link>
          <Link to='/crowdfunding' className={tabClass(isCrowdfunding)}>
            {t('navTop.crowdfunding')}
          </Link>
        </nav>

        <nav className='tab-bar-menu small-headlines' aria-label='Suggestion status'>
          <Link to='/' className={tabClass(isActiveSection)}>
            {t('navTop.active')}
          </Link>
          <Link to='/antrage-akzeptiert' className={tabClass(isAccepted)}>
            {t('navTop.accepted')}
          </Link>
          <Link to='/antrage-abgelehnt' className={tabClass(isRejected)}>
            {t('navTop.rejected')}
          </Link>
        </nav>

        <nav className='tab-bar-menu small-headlines' aria-label='Sort order'>
          <Link to='/' className={tabClass(!isMostPopular)}>
            {t('navTop.newest')}
          </Link>
          <Link
            to='/antrage-aktiv-am-beliebtesten'
            className={tabClass(isMostPopular)}
          >
            {t('navTop.mostPopular')}
          </Link>
        </nav>
      </div>
    </header>
  );
};
