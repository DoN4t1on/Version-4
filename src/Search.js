import { useTranslation } from 'react-i18next';
import { NavbarBottom } from './NavbarBottom';
import { AppPage } from './components/layout/AppPage';

export const Search = () => {
  const { t } = useTranslation();

  return (
    <AppPage>
      <div className='search-header'>
        <div className='search-title'>
          <input className='search-input' placeholder={t('navTop.searchPlaceholder')} />
        </div>
      </div>

      <p className='under-work-statement'>{t('pages.workInProgress')}</p>

      <NavbarBottom />
    </AppPage>
  );
};
