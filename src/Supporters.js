import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import moment from 'moment-timezone';
import { useTranslation } from 'react-i18next';
import { PageShell } from './components/layout/PageShell';
import ErrorService from './services/formatError/ErrorService';
import userServices from './services/httpService/userAuth/userServices';
import { toast } from 'react-toastify';

export const Supporters = () => {
  const { t } = useTranslation();
  const { Id } = useParams();
  const [allbidders, setAllBidders] = React.useState([]);

  useQuery('getBidder', () => userServices.commonGetService(`/post/getBidders/${Id}`), {
    refetchOnWindowFocus: false,
    onError: (error) => {
      toast.error(ErrorService.uniformError(error));
    },
    onSuccess: (res) => {
      setAllBidders(res.data.data);
    },
  });

  return (
    <PageShell title={t('pages.supporters')} contentClassName='voter-div-one'>
      <div className='voter-div-two'>
        {allbidders.map((item) => (
          <p className='supporter' key={item._id}>
            <Link to={`/profil/${item.user._id}`} className='linkblack'>
              {item.user.fname}•{item.amount}€
              <span className='time-supported'>
                {item.isIncognito ? ` ${moment(item.dateTime).format('YYYY-MM-DD')}` : ''}
              </span>
            </Link>
          </p>
        ))}
      </div>
    </PageShell>
  );
};
