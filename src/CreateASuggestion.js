import { NavbarBottom } from './NavbarBottom';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { store } from './reactStore/MainStore';
import { localStorageData } from './services/auth/localStorageData';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import ErrorService from './services/formatError/ErrorService';
import userServices from './services/httpService/userAuth/userServices';
import { useFormik } from 'formik';
import { useMutation, useQuery } from 'react-query';
import { toast } from 'react-toastify';

import * as Yup from 'yup';
const Input = styled('input')({
  display: 'none',
});

export const CreateASuggestion = () => {
  let navigate = useNavigate();

  const [currentLat, setcurrentLat] = useState(store.getState().Geo.lat);
  const [currentLong, setcurrentLong] = useState(store.getState().Geo.long);

  const onChangeHandler = async (e) => {
    var reader = new FileReader();
    reader.onload = function () {
      var output = document.getElementById('output');
      output.src = reader.result;
    };
    if (e.target.files[0]) {
      const file = e.target.files[0];
      reader.readAsDataURL(file);

      formik.setFieldValue('pics', file);
    }
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      pics: '',
      lat: currentLat,
      long: currentLong,
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required('erforderlich'),
      description: Yup.string().required('erforderlich'),
      pics: Yup.string().required('erforderlich'),
    }),
    onSubmit: async (values) => {
      if (localStorageData('_id')) {
        values.userid = localStorageData('_id');

        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('pics', values.pics);
        formData.append('lat', currentLat);
        formData.append('long', currentLong);
        formData.append('userId', localStorageData('_id'));

        addNewSuggestion.mutate(formData);
      } else {
        toast.error('Erstellen Sie ein Profil um fortzufahren');
      }
    },
  });

  const addNewSuggestion = useMutation(
    (NewSuggestion) =>
      userServices.commonPostService('/post/uploadPost', NewSuggestion),
    {
      onError: (error) => {
        toast.error(ErrorService.uniformError(error));
      },
      onSuccess: (res) => {
        toast.success('Ihr Antrag wurde erfolgreich erstellt und wird überprüft');
        navigate('/');
      },
    }
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <div className='casual-header-div'>
        <h4 className='headline'>Erstellen Sie einen Antrag</h4>
      </div>

      <div className='casual-menu'>
        <form onSubmit={formik.handleSubmit}>
          <p className='create-titel create-font-size'>Titel:</p>

          <input
            id='title'
            name='title'
            type='title'
            maxLength='60'
            className='input-style1'

            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.title}
          />
          {formik.touched.title && formik.errors.title ? (
            <div className='error-color'>{formik.errors.title}</div>
          ) : null}

          <br />
        
          <p className='create-font-size'>Bild:</p>

          <label htmlFor='icon-button-file'>
            <Input
              accept='image/*'
              onChange={onChangeHandler}
              id='icon-button-file'
              type='file'
            />
            {formik.values.pics ? (
              <div>
                <img
                  id='output'
                  src='https://ui-avatars.com/api/?name=John+Doe'
                  className='upload-img max-width-100'
                  alt=''
                />
              </div>
            ) : null}
            <div>
              <IconButton
                size='large'
                id='output'
                aria-label='upload picture'
                component='span'
                className='camera'
              >
                <PhotoCamera
                  id='output'
                  sx={{ fontSize: 45, color: '#28a745' }}
                />
              </IconButton>
            </div>
          </label>
          {formik.touched.pics && formik.errors.pics ? (
            <div className='error-color'>{formik.errors.pics}</div>
          ) : null}

          <p className='create-font-size'>Begründung:</p>

          <div className=''>
            <textarea
              id='description'
              name='description'
              type='description'
              className='input-style2'
              rows='5'
              cols='2'


              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description}
            />



            {formik.touched.description && formik.errors.description ? (
              <div className='error-color'>{formik.errors.description}</div>
            ) : null}
          </div>
          <br />
          {addNewSuggestion.isLoading ? (
            <CircularProgress />
          ) : (
           <button type='submit' className='btn btn-success btn-lg button'>
              Erstellen
            </button>
          )}
        </form>
      </div>

      <NavbarBottom
        classstart='under-navitem-unselected'
        classsearch='under-navitem-unselected'
        classactivity='under-navitem-unselected'
        classprofile='under-navitem-unselected'
      />
    </div>
  );
};
