import { useTranslation } from 'react-i18next';
import { PageShell } from './components/layout/PageShell';

export const Activity = () => {
  const { t } = useTranslation();

  return (
    <PageShell title={t('activity.title')} showBack={false} contentClassName=''>
      <p className='under-work-statement'>{t('pages.workInProgress')}</p>
    </PageShell>
  );
};
