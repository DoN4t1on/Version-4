import { NavbarBottom } from './NavbarBottom';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import WrappedMap from './Maps';
import { mapAPiKey } from './config/config';
import { useDispatch } from 'react-redux';
import { SET_City, SET_LatLong } from './reactStore/actions/Actions';
import { localStorageData } from './services/auth/localStorageData';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import ErrorService from './services/formatError/ErrorService';
import userServices from './services/httpService/userAuth/userServices';
import { useFormik } from 'formik';
import { useMutation, useQuery } from 'react-query';
import { toast } from 'react-toastify';
import Geocode from 'react-geocode';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { AppPage } from './components/layout/AppPage';
import { PageHeader } from './components/layout/PageHeader';
const Input = styled('input')({
  display: 'none',
});

export const SetLocation = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const [currentLat, setcurrentLat] = useState();
  const [currentLong, setcurrentLong] = useState();

  const [locationName, setlocationName] = useState('');

  const [latlong, setlatlong] = useState({ lat: currentLat, lng: currentLong });

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

      lat: Yup.number().required('erforderlich'),
      long: Yup.number().required('erforderlich'),
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

      // toast('');
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

  useEffect(() => {
    if (currentLat && currentLong) {
      let payload = {
        lat: currentLat,
        long: currentLong,
      };

      dispatch(SET_LatLong(payload));

      Geocode.fromLatLng(
        currentLat,
        currentLong
        //6.9679737
      ).then(
        (response) => {
          var city = '';
          var state = '';
          var country = '';
          var zipcode = '';

          var address_components = response.results[0].address_components;

          for (var i = 0; i < address_components.length; i++) {
            if (
              address_components[i].types[0] ===
              'administrative_area_level_1' &&
              address_components[i].types[1] === 'political'
            ) {
              state = address_components[i].long_name;
            }
            if (
              address_components[i].types[0] === 'locality' &&
              address_components[i].types[1] === 'political'
            ) {
              city = address_components[i].long_name;
            }

            if (
              address_components[i].types[0] === 'postal_code' &&
              zipcode == ''
            ) {
              zipcode = address_components[i].long_name;
            }

            if (address_components[i].types[0] === 'country') {
              country = address_components[i].long_name;
            }
          }

          dispatch(SET_City({ locationName: city, manualLocation: true }));
        },
        (error) => {
          console.error(error);

          //   dispatch(
          //     SET_City({ locationName: 'Standort', manualLocation: false })
          //   );

          //   let payload = {
          //     lat: 'false',
          //     long: 'false',
          //   };

          //   dispatch(SET_LatLong(payload));
        }
      );
    }
  }, [currentLat, currentLong]);

  return (
    <AppPage>
      <PageHeader title={t('pages.location')} />
      <div
        style={{
          position: 'fixed',
          top: '0px',
          left: '0px',
          height: '100%',
          width: '100%',
        }}
      >
        <WrappedMap
          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${mapAPiKey}`}
          loadingElement={<div style={{ height: `100%` }} />}


          containerElement={<div style={{ height: `100%`, width: '100%' }} />}

          mapElement={<div style={{ height: `100%` }} />}
          setlat={setcurrentLat}
          setlong={setcurrentLong}
          latlong={latlong}
          setlatlong={setlatlong}
          setlocationName={setlocationName}
        />
      </div>
      <NavbarBottom />
    </AppPage>
  )
}
