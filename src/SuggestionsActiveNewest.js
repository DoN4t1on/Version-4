import React, { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { Suggestion } from './Suggestion';
import { NavbarBottom } from './NavbarBottom';
import { NavbarTop } from './NavbarTop';
import ErrorService from './services/formatError/ErrorService';
import userServices from './services/httpService/userAuth/userServices';

export const SuggestionsActiveNewest = () => {
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

  useEffect(() => {
    ReactGA.initialize('G-L7KNR2MM11');
    ReactGA.send('/');
  }, []);

  return (
    <div>
      <NavbarTop suggestions={true} suggestions_active={true} newest={true} />
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
