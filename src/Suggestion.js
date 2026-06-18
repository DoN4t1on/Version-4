import { useEffect, useState } from 'react';
import moment from 'moment-timezone';
import { Link, useNavigate } from 'react-router-dom';
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

export const Suggestion = ({ item }) => {
  const navigate = useNavigate();
  const localtz = moment.tz.guess();

  const [upvotecounter, setUpvotecounter] = useState(item.upvotes.length);
  const [downvotecounter, setDownvotecounter] = useState(item.downvotes.length);
  const [upvoteimage, setUpvoteimage] = useState(upvoteempty);
  const [downvoteimage, setDownvoteimage] = useState(downvoteempty);
  const [supporters, setSupporters] = useState(item.bidder);
  const [amount, setAmount] = useState('');

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
    toast.error('Erstellen Sie ein Profil um fortzufahren');
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
      toast.error('Erstellen Sie ein Profil um fortzufahren');
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
    <div className='single-campaign'>
      <div className='campaign-header'>
        <Link style={{ visibility: 'hidden' }} to='/'>
          <button className='btn btn-success button small'>
            <img className='clock' src={require('./img/clock-fill.svg')} />
            (Zeit)
          </button>
        </Link>

        <Link
          to='/melden'
          state={{
            name: 'Suggestion',
            Id: item._id,
            link: `https://app.lokalspende.org/geteilter-antrag/${item._id}`,
          }}
        >
          <img src={require('./img/three-dots.svg')} className='report' />
        </Link>

        <div className='post-creator-div'>
          <Link to={`/profil/${item.user._id}`}>
            {item.user != '' ? (
              <button className='btn btn-success button small position-right'>
                <span className='Suggestion-creator-name'>{item.user.fname}</span>
              </button>
            ) : null}
          </Link>
        </div>
      </div>

      <p className='Suggestion-titel'>{item.title}</p>

      <img src={ImageEndPoint + item.pic} className='Suggestion-picture' />

      <br />

      <p className='Suggestion-desc'>{item.description}</p>
      <p className='donation-statements'>Spendenzusagen:</p>

      <Link to={`/spendenzusagen/${item._id}`} className='unterstützer-link'>
        <p className='Supporters'>{supporters}</p>
      </Link>

      <form onSubmit={handleSubmit}>
        <p className='amount-p'>
          <input
            type='number'
            min='1'
            value={amount}
            className='amount'
            id='inputAmount'
            placeholder='0'
            onChange={(e) => setAmount(Number(e.target.value))}
            required
          />
          <span className='euros'>€</span>
        </p>

        <button
          className='btn btn-success button-Suggestion btn-lg button border-black'
          type='submit'
          id='Donate'
        >
          Spende zusagen
        </button>
      </form>

      <div className='interaction-bar'>
        <div className='voting-div'>
          <div>
            <img
              onClick={upvote}
              src={upvoteimage}
              className='voting-button'
              id='upvotebutton'
            />
            <Link className='linkblack' to={`/upvoter/${item._id}`}>
              <p id='upvotes' className='voting-counter-upanddown '>
                {upvotecounter}
              </p>
            </Link>
          </div>

          <div>
            <img
              onClick={downvote}
              src={downvoteimage}
              className='voting-button'
              id='downvotebutton'
            />
            <Link className='linkblack' to={`/downvoter/${item._id}`}>
              <p id='downvotes' className='voting-counter-upanddown '>
                {downvotecounter}
              </p>
            </Link>
          </div>
        </div>

        <div className='comments-div'>
          <Link to={`/neuste-kommentare/${item._id}`}>
            <img src={require('./img/comments.svg')} className='comments-img' />
            <span className='comments-counter'>{item.comments}</span>
          </Link>
        </div>

        <Link to='/teilen' state={{ url: '/geteilter-antrag/' + item._id }}>
          <img src={require('./img/share.svg')} className='share-button' />
        </Link>
      </div>

      <div className='divider-horizontal-rule'>
        <div className='black-hr'></div>
      </div>
    </div>
  );
};
