import { useTranslation } from 'react-i18next';
import { PageShell } from './components/layout/PageShell';

export const CreationFilter = () => {
  const { t } = useTranslation();

  return (
    <PageShell title={t('pages.creationFilter')} showBack={false}>
      <p className='info'>
        Filtert Anträge und Crowdfundingkampagnen nach der Zeit wann sie erstellt wurden.
      </p>
    </PageShell>
  );
};
