import { useEffect, useState } from 'react';
import moment from 'moment-timezone';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import upvoteempty from './img/arrow-up.svg';
import upvotefull from './img/arrow-up-fill.svg';
import downvoteempty from './img/arrow-down.svg';
import downvotefull from './img/arrow-down-fill.svg';
import { ImageEndPoint } from './config/config';
import { localStorageData } from './services/auth/localStorageData';
import ErrorService from './services/formatError/ErrorService';
import userServices from './services/httpService/userAuth/userServices';
import { ShareSheet } from './components/ShareSheet';

export const Suggestion = ({ item }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const localtz = moment.tz.guess();

  const [upvotecounter, setUpvotecounter] = useState(item.upvotes.length);
  const [downvotecounter, setDownvotecounter] = useState(item.downvotes.length);
  const [upvoteimage, setUpvoteimage] = useState(upvoteempty);
  const [downvoteimage, setDownvoteimage] = useState(downvoteempty);
  const [supporters, setSupporters] = useState(item.bidder);
  const [amount, setAmount] = useState('');
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    item.downvotes.forEach((vote) => {
      if (vote.userId == localStorageData('_id')) {
        setDownvoteimage(downvotefull);
      }
    });

    item.upvotes.forEach((vote) => {
      if (vote.userId == localStorageData('_id')) {
        setUpvoteimage(upvotefull);
      }
    });
  }, [item.downvotes, item.upvotes]);

  const bidOnPost = useMutation(
    (newBid) => userServices.commonPostService('/post/bidOnPost', newBid),
    {
      onError: (error) => {
        toast.error(ErrorService.uniformError(error));
      },
      onSuccess: (res) => {
        if (res.data.isNew) {
          setSupporters((value) => value + 1);
        }
      },
    }
  );

  const upvoteOnPost = useMutation(
    (payload) => userServices.commonPostService('/post/upVote', payload),
    {
      onError: (error) => {
        toast.error(ErrorService.uniformError(error));
      },
      onSuccess: (res) => {
        setUpvotecounter(res.data.data[0].upvotes.length);
        setDownvotecounter(res.data.data[0].downvotes.length);
      },
    }
  );

  const downvoteOnPost = useMutation(
    (payload) => userServices.commonPostService('/post/downVote', payload),
    {
      onError: (error) => {
        toast.error(ErrorService.uniformError(error));
      },
      onSuccess: (res) => {
        setUpvotecounter(res.data.data[0].upvotes.length);
        setDownvotecounter(res.data.data[0].downvotes.length);
      },
    }
  );

  const redirectToLogin = () => {
    navigate('/dein-profil', { replace: true });
    toast.error(t('toast.loginRequired'));
  };

  const upvote = () => {
    if (!localStorageData('_id')) {
      redirectToLogin();
      return;
    }

    setUpvoteimage((current) => (current == upvotefull ? upvoteempty : upvotefull));
    setDownvoteimage(downvoteempty);

    upvoteOnPost.mutate({
      userId: localStorageData('_id'),
      postId: item._id,
      timeZone: localtz,
      dateTime: new Date(),
    });
  };

  const downvote = () => {
    if (!localStorageData('_id')) {
      redirectToLogin();
      return;
    }

    setDownvoteimage((current) => (current == downvotefull ? downvoteempty : downvotefull));
    setUpvoteimage(upvoteempty);

    downvoteOnPost.mutate({
      userId: localStorageData('_id'),
      postId: item._id,
      timeZone: localtz,
      dateTime: new Date(),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!localStorageData('_id')) {
      toast.error(t('toast.loginRequired'));
      return;
    }

    bidOnPost.mutate({
      userId: localStorageData('_id'),
      postId: item._id,
      amount,
      timeZone: localtz,
      dateTime: new Date(),
    });
    setAmount('');
  };

  return (
    <article className='single-campaign suggestion-card'>
      <div className='suggestion-card__top'>
        {item.user ? (
          <Link to={`/profil/${item.user._id}`} className='suggestion-card__author'>
            {item.user.fname}
          </Link>
        ) : (
          <span />
        )}

        <Link
          to='/melden'
          className='suggestion-card__menu'
          state={{
            name: 'Suggestion',
            Id: item._id,
            link: `https://app.lokalspende.org/geteilter-antrag/${item._id}`,
          }}
        >
          <img src={require('./img/three-dots.svg')} alt='' />
        </Link>
      </div>

      <div className='suggestion-card__body'>
        <h2 className='Suggestion-titel'>{item.title}</h2>
        <p className='Suggestion-desc'>{item.description}</p>
      </div>

      {item.pic ? (
        <img
          src={ImageEndPoint + item.pic}
          className='Suggestion-picture suggestion-card__media'
          alt=''
        />
      ) : null}

      <div className='suggestion-card__pledge'>
        <div>
          <p className='donation-statements'>{t('suggestions.pledgeLabel')}</p>
          <Link to={`/spendenzusagen/${item._id}`} className='unterstützer-link'>
            <p className='Supporters suggestion-card__pledge-count'>{supporters}</p>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className='suggestion-card__pledge-form'>
          <label className='amount-p' htmlFor={`inputAmount-${item._id}`}>
            <input
              type='number'
              min='1'
              value={amount}
              className='amount'
              id={`inputAmount-${item._id}`}
              placeholder='0'
              onChange={(e) => setAmount(Number(e.target.value))}
              required
            />
            <span className='euros'>€</span>
          </label>

          <button
            className='btn btn-success button-Suggestion btn-lg button'
            type='submit'
          >
            {t('suggestions.pledgeButton')}
          </button>
        </form>
      </div>

      <div className='suggestion-card__actions'>
        <div className='suggestion-card__vote-group'>
          <div className='suggestion-card__vote'>
            <img
              onClick={upvote}
              src={upvoteimage}
              className='voting-button'
              alt='Upvote'
            />
            <Link className='linkblack' to={`/upvoter/${item._id}`}>
              <p className='voting-counter-upanddown'>{upvotecounter}</p>
            </Link>
          </div>

          <div className='suggestion-card__vote'>
            <img
              onClick={downvote}
              src={downvoteimage}
              className='voting-button'
              alt='Downvote'
            />
            <Link className='linkblack' to={`/downvoter/${item._id}`}>
              <p className='voting-counter-upanddown'>{downvotecounter}</p>
            </Link>
          </div>
        </div>

        <div className='suggestion-card__meta-group'>
          <Link to={`/neuste-kommentare/${item._id}`} className='comments-div'>
            <img src={require('./img/comments.svg')} className='comments-img' alt='' />
            <span className='comments-counter'>{item.comments}</span>
          </Link>

          <button
            type='button'
            className='share-trigger'
            onClick={() => setShareOpen(true)}
            aria-label={t('pages.share')}
          >
            <img src={require('./img/share.svg')} className='share-button' alt='' />
          </button>
        </div>
      </div>

      <ShareSheet
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        url={'/geteilter-antrag/' + item._id}
      />
    </article>
  );
};
