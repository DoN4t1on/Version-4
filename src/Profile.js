import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { PageShell } from './components/layout/PageShell';
import { ImageEndPoint } from './config/config';
import ErrorService from './services/formatError/ErrorService';
import userServices from './services/httpService/userAuth/userServices';

export const Profile = () => {
  const { t } = useTranslation();
  const { Id } = useParams();
  const [userDetail, setUserDetail] = React.useState(null);

  useQuery('getSingleuserData', () => userServices.commonGetService(`/userAuth/getSingleUserDetail/${Id}`), {
    refetchOnWindowFocus: false,
    onError: (error) => {
      toast.error(ErrorService.uniformError(error));
    },
    onSuccess: (res) => {
      setUserDetail(res.data.data);
    },
  });

  if (!userDetail) {
    return null;
  }

  return (
    <PageShell title={t('profile.pageTitle')}>
      <p className='profile-name'>{userDetail.fname}</p>
      <img
        src={userDetail.pic ? ImageEndPoint + userDetail.pic : require('./img/profile.png')}
        className='profile-picture-fullscreen'
        alt=''
      />
      <br />
      <p className='profile-description'>{userDetail.description}</p>
      <span className='profile-link-span'>
        <img
          className='link-profile'
          src={userDetail.link !== '' ? require('./img/link.svg') : ''}
          alt=''
        />
        <button type='button' className='profile-link' onClick={() => window.open(userDetail.link)}>
          {userDetail.link}
        </button>
      </span>
    </PageShell>
  );
};
