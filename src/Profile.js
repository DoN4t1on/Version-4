import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { NavbarBottom } from './NavbarBottom';
import { ImageEndPoint } from './config/config';
import ErrorService from './services/formatError/ErrorService';
import userServices from './services/httpService/userAuth/userServices';

export const Profile = () => {
  const navigate = useNavigate();
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

  return (
    <div>
      {userDetail ? (
        <>
          <div className='casual-header-div '>
            <button className='back-button-button' onClick={() => navigate(-1)}>
              <img
                className='back-button-icon'
                src={require('./img/arrow-left-short.svg')}
              />
            </button>
            <h4 className='headline headline-with-back-button'>Profil</h4>
          </div>

          <div className='casual-menu'>
            <p className='profile-name'>{userDetail.fname}</p>

            <img
              src={userDetail.pic ? ImageEndPoint + userDetail.pic : require('./img/profile.png')}
              className='profile-picture-fullscreen'
            />
            <br />
            <p className='profile-description'>{userDetail.description}</p>

            {userDetail.link ? (
              <span className='profile-link-span'>
                <img className='link-profile' src={require('./img/link.svg')} />
                <a className='profile-link' onClick={() => window.open(userDetail.link)}>
                  {userDetail.link}
                </a>
              </span>
            ) : null}

            {userDetail.address ? <p>{userDetail.address}</p> : null}
          </div>

          <NavbarBottom
            classstart='under-navitem-selected'
            classsearch='under-navitem-unselected'
            classactivity='under-navitem-unselected'
            classprofile='under-navitem-unselected'
          />
        </>
      ) : null}
    </div>
  );
};
