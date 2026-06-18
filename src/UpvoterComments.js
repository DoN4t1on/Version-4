import React from 'react';
import moment from 'moment-timezone';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { NavbarBottom } from './NavbarBottom';
import ErrorService from './services/formatError/ErrorService';
import userServices from './services/httpService/userAuth/userServices';
import { toast } from 'react-toastify';

export const UpvoterComments = () => {
  const navigate = useNavigate();
  const { Id } = useParams();
  const [allUpvoters, setAllUpvoters] = React.useState([]);

  useQuery('getUpvoterComments', () => userServices.commonGetService(`/post/getUpvoterListComments/${Id}`), {
    refetchOnWindowFocus: false,
    onError: (error) => {
      toast.error(ErrorService.uniformError(error));
    },
    onSuccess: (res) => {
      setAllUpvoters(res.data.data);
    },
  });

  return (
    <div>
      <div className='casual-header-div '>
        <button className='back-button-button' onClick={() => navigate(-1)}>
          <img
            className='back-button-icon'
            src={require('./img/arrow-left-short.svg')}
          />
        </button>
        <h4 className='headline headline-with-back-button'>Upvoter</h4>
      </div>

      <div className='voter-div-one '>
        <div className='voter-div-two '>
          {allUpvoters.map((item) => (
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
      </div>

      <NavbarBottom
        classstart='under-navitem-selected'
        classsearch='under-navitem-unselected'
        classactivity='under-navitem-unselected'
        classprofile='under-navitem-unselected'
      />
    </div>
  );
};
