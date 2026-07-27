import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageShell } from './components/layout/PageShell';
import { ShareLinks } from './components/ShareSheet';

// Fallback route for old /teilen links — sharing normally happens in the
// in-place ShareSheet.
export const Share = () => {
  const { t } = useTranslation();
  const { state } = useLocation();
  const urlToSend = state?.url ?? '';

  return (
    <PageShell title={t('pages.share')}>
      <div className='sharing-right'>
        <ShareLinks url={urlToSend} />
      </div>
    </PageShell>
  );
};
