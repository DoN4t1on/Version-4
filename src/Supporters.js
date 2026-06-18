import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import moment from 'moment-timezone';
import { NavbarBottom } from './NavbarBottom';
import ErrorService from './services/formatError/ErrorService';
import userServices from './services/httpService/userAuth/userServices';
import { toast } from 'react-toastify';

export const Supporters = () => {
  const navigate = useNavigate();
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
    <div>
      <div className='casual-header-div '>
        <button className='back-button-button' onClick={() => navigate(-1)}>
          <img
            className='back-button-icon'
            src={require('./img/arrow-left-short.svg')}
          />
        </button>
        <h4 className='headline headline-with-back-button'>Spendenzusagen</h4>
      </div>

      <div className='voter-div-one '>
        <div className='voter-div-two '>
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
