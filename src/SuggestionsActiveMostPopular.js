import React, { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { Suggestion } from './Suggestion';
import { NavbarBottom } from './NavbarBottom';
import { NavbarTop } from './NavbarTop';
import ErrorService from './services/formatError/ErrorService';
import userServices from './services/httpService/userAuth/userServices';

export const SuggestionsActiveMostPopular = () => {
  const [allPost, setAllPost] = React.useState([]);

  useQuery(
    'allpostMostPopular',
    () => userServices.commonGetService('/post/getAllMostPopularPost/0'),
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
      onError: (error) => {
        toast.error(ErrorService.uniformError(error));
      },
      onSuccess: (res) => {
        const normalized = res.data.data.map((post) => ({
          ...post,
          upVote: post.upVote ?? 0,
          downVote: post.downVote ?? 0,
          bidder: post.bidder ?? 0,
        }));

        setAllPost(normalized);
      },
    }
  );

  useEffect(() => {
    ReactGA.initialize('G-L7KNR2MM11');
    ReactGA.send('/');
  }, []);

  return (
    <div>
      <NavbarTop suggestions={true} suggestions_active={true} favourites={true} />
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
