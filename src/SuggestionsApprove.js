import React, { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { Suggestion } from './Suggestion';
import { PageShell } from './components/layout/PageShell';
import ErrorService from './services/formatError/ErrorService';
import userServices from './services/httpService/userAuth/userServices';

export const SuggestionsApprove = () => {
  const { t } = useTranslation();
  const { Id } = useParams();
  const [allPost, setAllPost] = React.useState([]);

  useQuery('SuggestionsApprove', () => userServices.commonGetService(`/post/getApproveSuggestion/${Id}`), {
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
  });

  useEffect(() => {
    ReactGA.initialize('G-L7KNR2MM11');
    ReactGA.send('/');
  }, []);

  return (
    <PageShell title={t('suggestions.sharedTitle')} showBack={false} contentClassName='sharing'>
      {allPost.map((item) => (
        <Suggestion item={item} key={item._id} />
      ))}
    </PageShell>
  );
};
