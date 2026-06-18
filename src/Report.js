import { NavbarBottom } from './NavbarBottom';
import { useMutation } from 'react-query';
import ErrorService from './services/formatError/ErrorService';
import userServices from './services/httpService/userAuth/userServices';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

export const Report = () => {
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
        toast.success('Der Beitrag wurde gemeldet');
        navigate('/');
      },
    }
  );

  return (
    <div>
      <div className='casual-header-div '>
        <button className='back-button-button' onClick={() => navigate(-1)}>
          <img
            className='back-button-icon'
            src={require('./img/arrow-left-short.svg')}
          />
        </button>
        <h4 className='headline headline-with-back-button'> Mehr </h4>
      </div>
      <div className='casual-menu'>
        <button
          onClick={() => sendReport.mutate({ link })}
          className='btn btn-success btn-lg button'
        >
          Melden
        </button>
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
