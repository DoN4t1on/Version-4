import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReactGA from 'react-ga4';
import Geocode from 'react-geocode';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { Suggestion } from './Suggestion';
import { NavbarBottom } from './NavbarBottom';
import { NavbarTop } from './NavbarTop';
import { AppPage } from './components/layout/AppPage';
import ErrorService from './services/formatError/ErrorService';
import userServices from './services/httpService/userAuth/userServices';
import { mapAPiKey } from './config/config';
import { SET_City, SET_LatLong } from './reactStore/actions/Actions';
import { store } from './reactStore/MainStore';

export const Suggestions = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { locationName, lat } = useSelector((state) => state.Geo);

  Geocode.setApiKey(mapAPiKey);

  const [allPost, setAllPost] = React.useState([]);
  const [chunksPost, setChunksPost] = React.useState(0);
  const [moreRefetch, setMoreRefetch] = React.useState(true);

  useQuery(
    'allpostSuggestions',
    () => userServices.commonGetService(`/post/getAllPost/${chunksPost}/false/false`),
    {
      refetchOnWindowFocus: false,
      refetchInterval: moreRefetch ? 500 : false,
      refetchIntervalInBackground: true,
      onError: (error) => {
        toast.error(ErrorService.uniformError(error));
      },
      onSuccess: (res) => {
        if (!res.data.data?.length) {
          setMoreRefetch(false);
          return;
        }

        setChunksPost((value) => value + 1);

        const normalized = res.data.data.map((post) => ({
          ...post,
          upVote: post.upVote ?? 0,
          downVote: post.downVote ?? 0,
          bidder: post.bidder ?? 0,
        }));

        setAllPost((current) => [...current, ...normalized]);
      },
    }
  );

  function track() {
    ReactGA.initialize('G-L7KNR2MM11');
    ReactGA.send('/');
  }

  useEffect(() => {
    track();
  }, []);

  async function setKolin() {
    dispatch(SET_LatLong({ lat: 50.9361189, long: 6.9564453 }));
    dispatch(SET_City({ locationName: 'Köln', manualLocation: false }));
    navigate('/');
  }

  return (
    <AppPage>
      <NavbarTop />
      <div className='campaigns'>
        {locationName ? null : (
          <div className='statement-Suggestions'>
            {t('suggestions.locationNotSet')}
            <br />
            <br />
            <button type='button' className='statement-link' onClick={setKolin}>
              {t('suggestions.setCologneDefault')}
            </button>
          </div>
        )}
        {allPost.map((item) => (
          <Suggestion item={item} key={item._id} />
        ))}
      </div>
      <NavbarBottom />
    </AppPage>
  );
};
