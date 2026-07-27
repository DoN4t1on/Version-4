import { useTranslation } from 'react-i18next';
import { PageShell } from './components/layout/PageShell';

export const VotingFilter = () => {
  const { t } = useTranslation();

  return (
    <PageShell title={t('pages.votingFilter')} showBack={false}>
      <p className='info'>
        „Relevante Votes” sind Votes von Nutzern bei denen der Wohnort innerhalb des angesprochenen
        Verwaltungsbereichs liegt. Es zählen nur die relevanten Votes für die Reihenfolge der
        Einreichung des Projekts. „Votes insgesamt” sind Votes aus der ganzen Welt.
      </p>
    </PageShell>
  );
};
