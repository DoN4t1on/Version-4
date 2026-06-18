import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReactGA from 'react-ga4';
import Geocode from 'react-geocode';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { Suggestion } from './Suggestion';
import { NavbarBottom } from './NavbarBottom';
import { NavbarTop } from './NavbarTop';
import ErrorService from './services/formatError/ErrorService';
import userServices from './services/httpService/userAuth/userServices';
import { mapAPiKey } from './config/config';
import { SET_City, SET_LatLong } from './reactStore/actions/Actions';
import { store } from './reactStore/MainStore';

export const Suggestions = () => {
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
        if (res.data.data == '') {
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
    <div>
      <NavbarTop suggestions={true} suggestions_active={true} newest={true} />
      {locationName ? null : (
        <div className='campaigns no-data statement-Suggestions'>
          Standort ist noch nicht gesetzt. Die Anträge werden trotzdem angezeigt.
          <br />
          <br />
          <a style={{ color: 'blue' }} onClick={setKolin}>
            Köln als Standard setzen
          </a>
        </div>
      )}
      <div className='campaigns'>
        {allPost.map((item) => (
          <Suggestion item={item} key={item._id} />
        ))}
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
