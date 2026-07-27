import { NavbarBottom } from './NavbarBottom';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import * as React from 'react';
import { storeLocalData } from './services/auth/localStorageData';
import { localStorageData } from './services/auth/localStorageData';
import ErrorService from './services/formatError/ErrorService';
import userServices from './services/httpService/userAuth/userServices';
import { useMutation } from 'react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { ImageEndPoint } from './config/config';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Signin from './Signin';
import Signup from './Signup';
import { PageHeader } from './components/layout/PageHeader';
import { AppPage } from './components/layout/AppPage';

export const YourProfile = () => {
  const { t } = useTranslation();
  const Input = styled('input')({
    display: 'none',
  });

  let navigate = useNavigate();
  const [desc, setdesc] = React.useState(localStorageData('description'));

  const [lat, setlat] = React.useState('');

  const [long, setlong] = React.useState('');

  const [link, setlink] = React.useState(localStorageData('link'));

  const [fname, setfname] = React.useState(localStorageData('fname'));

  const [location, setlocation] = React.useState(localStorageData('address'));
  const [pic, setpic] = React.useState('');

  const updateProfile = useMutation(
    (NewProfile) =>
      userServices.commonPostService('/userAuth/updateuserinfo', NewProfile),
    {
      onError: (error) => {
        toast.error(ErrorService.uniformError(error));
      },
      onSuccess: (res) => {
        storeLocalData(res.data.data);

        // storeLocalData(data.data);

        toast.success(t('toast.profileUpdated'));
        navigate('/');
      },
    }
  );

  const theme = createTheme({
    palette: {
      success: {
        main: '#28a745',
      },
    },
  });

  const updateUserProfile = async (e) => {
    const formData = new FormData();
    formData.append('userId', localStorageData('_id'));
    formData.append('lat', lat);
    formData.append('long', long);
    formData.append('fname', fname);
    formData.append('location', location);
    formData.append('link', link);
    formData.append('pics', pic);
    formData.append('desc', desc);
    updateProfile.mutate(formData);
  };

  const onChangeHandler = async (e) => {
    var reader = new FileReader();
    reader.onload = function () {
      var output = document.getElementById('output');
      output.src = reader.result;
    };
    if (e.target.files[0]) {
      const file = e.target.files[0];
      reader.readAsDataURL(file);

      setpic(file);
    }
  };

  return (
    <AppPage>
      <PageHeader
        title={t('profile.title')}
        rightAction={
          <Link to='/einstellungen' className='page-header__settings-link'>
            <img
              className='settings-image'
              src={require('./img/settings.svg')}
              alt=''
            />
          </Link>
        }
      />

      <div className='casual-menu'>
        {localStorageData('_id') ? (
          ''
        ) : (
          <div className='profile-welcome'>
            <span className='profile-welcome__icon'>
              <i className='material-icons'>person</i>
            </span>
            <h2 className='profile-welcome__title'>{t('profile.title')}</h2>
            <p className='profile-welcome__text'>{t('toast.loginRequired')}</p>
            <div className='profile-welcome__actions'>
              <Signin />
              <Signup />
            </div>
          </div>
        )}

        {localStorageData('_id') ? (
          <ThemeProvider theme={theme}>
            <img
              id='output'
              src={
                localStorageData('pic') != ''
                  ? ImageEndPoint + localStorageData('pic')
                  : require('./img/profile.png')
              }
              className='profile-picture-fullscreen'
            />

            <br />
            <label className='edit-picture-label' htmlFor='icon-button-file'>
              <Input
                accept='image/*'
                onChange={onChangeHandler}
                id='icon-button-file'
                type='file'
              />

              <img className='margin-bottom edit-picture' src={require('./img/pencil-square.svg')} />
            </label>

            <div className='profile-form'>
              <TextField
                id='outlined-start-adornment'
                label={t('profile.nameLabel')}
                onChange={(e) => setfname(e.target.value)}
                value={fname}
                sx={{ width: 'min(100%, 360px)' }}
                color='success'
              />

              <TextField
                id='outlined-multiline-static'
                label={t('profile.descriptionLabel')}
                onChange={(e) => setdesc(e.target.value)}
                value={desc}
                multiline
                rows={4}
                sx={{ width: 'min(100%, 360px)' }}
                color='success'
              />

              <TextField
                label={t('profile.websiteLabel')}
                placeholder={t('profile.websitePlaceholder')}
                size='small'
                onChange={(e) => setlink(e.target.value)}
                value={link}
                id='outlined-start-adornment'
                sx={{ width: 'min(100%, 360px)' }}
                color='success'
              />

              <button
                className='btn btn-success btn-lg button'
                type='submit'
                id='Update'
                onClick={() => {
                  updateUserProfile();
                }}
              >
                {t('profile.updateButton')}
              </button>
            </div>
          </ThemeProvider>
        ) : null}
      </div>
      <NavbarBottom />
    </AppPage>
  );
};
