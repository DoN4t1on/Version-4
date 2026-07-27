import React from 'react';
import moment from 'moment-timezone';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import { PageShell } from './layout/PageShell';
import ErrorService from '../services/formatError/ErrorService';
import userServices from '../services/httpService/userAuth/userServices';
import { toast } from 'react-toastify';

export function VoterList({ queryKey, endpoint, titleKey }) {
  const { t } = useTranslation();
  const { Id } = useParams();
  const [voters, setVoters] = React.useState([]);

  useQuery(queryKey, () => userServices.commonGetService(`${endpoint}/${Id}`), {
    refetchOnWindowFocus: false,
    onError: (error) => {
      toast.error(ErrorService.uniformError(error));
    },
    onSuccess: (res) => {
      setVoters(res.data.data);
    },
  });

  return (
    <PageShell title={t(titleKey)} contentClassName='voter-div-one'>
      <div className='voter-div-two'>
        {voters.map((item) => (
          <p className='supporter-list' key={item._id}>
            {item.isIncognito ? (
              <>
                Anonym
                <span className='time-supported'>
                  {moment(item.dateTime).format('YYYY-MM-DD')}
                </span>
              </>
            ) : (
              <Link to={`/profil/${item.user._id}`} className='linkblack'>
                {item.user.fname}
              </Link>
            )}
          </p>
        ))}
      </div>
    </PageShell>
  );
}
