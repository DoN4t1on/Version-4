import { useMutation } from 'react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { PageShell } from './components/layout/PageShell';
import ErrorService from './services/formatError/ErrorService';
import userServices from './services/httpService/userAuth/userServices';

export const Report = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { link } = location.state || {};

  const sendReport = useMutation(
    (newReport) => userServices.commonPostService('/post/sendReport', newReport),
    {
      onError: (error) => {
        toast.error(ErrorService.uniformError(error));
      },
      onSuccess: () => {
        toast.success(t('toast.reportSent'));
        navigate('/');
      },
    }
  );

  return (
    <PageShell title={t('report.title')}>
      <button
        type='button'
        onClick={() => sendReport.mutate({ link })}
        className='btn btn-success btn-lg button'
      >
        {t('pages.reportAction')}
      </button>
    </PageShell>
  );
};
