import { useTranslation } from 'react-i18next';
import { PageShell } from './components/layout/PageShell';

export const Map = () => {
  const { t } = useTranslation();

  return (
    <PageShell title={t('pages.map')} showBack={false}>
      <img src={require('./img/map.png')} alt='' />
    </PageShell>
  );
};
