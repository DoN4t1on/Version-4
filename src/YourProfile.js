import { NavbarBottom } from './NavbarBottom';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import * as React from 'react';
import { storeLocalData } from './services/auth/localStorageData';
import { localStorageData } from './services/auth/localStorageData';
import ErrorService from './services/formatError/ErrorService';
import userServices from './services/httpService/userAuth/userServices';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { ImageEndPoint } from './config/config';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Signin from './Signin';
import Signup from './Signup';

export const YourProfile = () => {
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

        toast.success('Das Profil wurde aktualisiert');
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
    <div>
      <div className='casual-header-div'>
        <Link to='/einstellungen'>
          {' '}
          <img
            className='settings-image'
            src={require('./img/settings.svg')}
          />{' '}
        </Link>
        <h4 className='headline headline-profilesettings'> Ihr Profil </h4>
      </div>

      <div className='casual-menu'>
        {localStorageData('_id') ? (
          ''
        ) : (
          <>
            <Signin />

            <br></br>
            <Signup />
          </>
        )}

        <br />

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

            <br />

            <TextField
              id='outlined-start-adornment'
              label='Name'
              onChange={(e) => setfname(e.target.value)}
              value={fname}
              multiline
              rows={1}
              sx={{ minWidth: '200px', maxheight: '5' }}
              color='success'
            />

            <br />
            <br />

            <div>
              <TextField
                id='outlined-multiline-static'
                label='Beschreibung'
                onChange={(e) => setdesc(e.target.value)}
                value={desc}
                multiline
                rows={4}
                sx={{ minWidth: '250px' }}
                color='success'
              />
              <br />
              <br />
              <TextField
                label='Webseite'
                placeholder='https://...'
                size='small'
                onChange={(e) => setlink(e.target.value)}
                value={link}
                id='outlined-start-adornment'
                sx={{ m: 1, width: '18ch' }}
                color='success'
              />
              <br />
              <br />
              <button
                className='btn btn-success btn-lg button border-black'
                type='submit'
                id='Update'
                onClick={() => {
                  updateUserProfile();
                }}
              >
                Aktualisieren
              </button>
            </div>
          </ThemeProvider>
        ) : null}
      </div>
      <NavbarBottom
        classstart='under-navitem-unselected'
        classsearch='under-navitem-unselected'
        classactivity='under-navitem-unselected'
        classprofile='under-navitem-selected'
      />
    </div>
  );
};
