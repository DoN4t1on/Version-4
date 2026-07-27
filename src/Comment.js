import upvoteempty from './img/arrow-up.svg';
import upvotefull from './img/arrow-up-fill.svg';
import downvoteempty from './img/arrow-down.svg';
import downvotefull from './img/arrow-down-fill.svg';

import { Link, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { localStorageData } from './services/auth/localStorageData';
import ErrorService from './services/formatError/ErrorService';
import userServices from './services/httpService/userAuth/userServices';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import moment from 'moment-timezone';
import { ShareSheet } from './components/ShareSheet';

export const Comment = (props) => {
  const { Id } = useParams();
  const localtz = moment.tz.guess();
  const [shareOpen, setShareOpen] = useState(false);
  const [sumcounter, setSumcounter] = useState(
    props.item.upvotecomments.length - props.item.downvotecomments.length
  );

  const [upvotecounter, setUpvotecounter] = useState(
    props.item.upvotecomments.length
  );

  const [downvotecounter, setDownvotecounter] = useState(
    props.item.downvotecomments.length
  );

  const [upvoteimage, setUpvoteimage] = useState(upvoteempty);

  const [downvoteimage, setDownvoteimage] = useState(downvoteempty);

  useEffect(() => {
    props.item.downvotecomments.map((item) => {
      if (item.userId == localStorageData('_id')) {
        setDownvoteimage(downvotefull);
      }
    });
    props.item.upvotecomments.map((item) => {
      if (item.userId == localStorageData('_id')) {
        setUpvoteimage(upvotefull);
      }
    });
  }, []);

  const upvote = () => {
    if (localStorageData('_id')) {
      if (upvoteimage == upvotefull) {
        setUpvoteimage(upvoteempty);
      } else {
        setUpvoteimage(upvotefull);
      }

      setDownvoteimage(downvoteempty);

      UpvoteOnPost.mutate({
        userId: localStorageData('_id'),
        expId: props.item._id,
        timeZone: localtz,
        dateTime: new Date(),
      });
    } else {
      toast.error('Erstellen Sie ein Profil um fortzufahren');
    }

    // if (upvotecounter == 0) {
    //   setUpvotecounter(upvotecounter + 1);

    //   setSumcounter(sumcounter + 1);
    //   setUpvoteimage(upvotefull);
    //   if (downvotecounter == -1) {
    //     setDownvotecounter(downvotecounter + 1);
    //     setSumcounter(sumcounter + 2);
    //     setDownvoteimage(downvoteempty);
    //   }
    // }

    // if (upvotecounter == 1) {
    //   setUpvotecounter(upvotecounter - 1);

    //   setSumcounter(sumcounter - 1);
    //   setUpvoteimage(upvoteempty);
    // }
  };

  const downvote = () => {
    if (localStorageData('_id')) {
      if (downvoteimage == downvotefull) {
        setDownvoteimage(downvoteempty);
      } else {
        setDownvoteimage(downvotefull);
      }

      setUpvoteimage(upvoteempty);

      DownvoteOnPost.mutate({
        userId: localStorageData('_id'),
        expId: props.item._id,
        timeZone: localtz,
        dateTime: new Date(),
      });
    } else {
      toast.error('Erstellen Sie ein Profil um fortzufahren');
    }

    // if (downvotecounter == 0) {
    //   setDownvotecounter(downvotecounter - 1);
    //   setSumcounter(sumcounter - 1);
    //   setDownvoteimage(downvotefull);
    //   if (upvotecounter == 1) {
    //     setUpvotecounter(upvotecounter - 1);

    //     setSumcounter(sumcounter - 2);
    //     setUpvoteimage(upvoteempty);
    //   }
    // }

    // if (downvotecounter == -1) {
    //   setDownvotecounter(downvotecounter + 1);
    //   setSumcounter(sumcounter + 1);
    //   setDownvoteimage(downvoteempty);
    // }
  };

  const UpvoteOnPost = useMutation(
    (NewBid) => userServices.commonPostService('/post/upVoteonComment', NewBid),
    {
      onError: (error) => {
        toast.error(ErrorService.uniformError(error));
      },
      onSuccess: (res) => {
        setUpvotecounter(res.data.data[0].upvotecomments.length);
        setDownvotecounter(res.data.data[0].downvotecomments.length);
        setSumcounter(
          res.data.data[0].upvotecomments.length -
          res.data.data[0].downvotecomments.length
        );
      },
    }
  );

  const DownvoteOnPost = useMutation(
    (down) => userServices.commonPostService('/post/downVoteonComment', down),
    {
      onError: (error) => {
        toast.error(ErrorService.uniformError(error));
      },
      onSuccess: (res) => {

        setUpvotecounter(res.data.data[0].upvotecomments.length);
        setDownvotecounter(res.data.data[0].downvotecomments.length);
        setSumcounter(
          res.data.data[0].upvotecomments.length -
          res.data.data[0].downvotecomments.length
        );

        //setUpvotecounter(res.data.data.upVote);
        //setDownvotecounter(res.data.data.downVote);
      },
    }
  );

  return (
    <div className='single-comment'>
      <div className='comment-card__top'>
        <Link
          to={`/profil/${props.item.user[0]._id}`}
          className='comment-card__author'
        >
          {props.item.user[0].fname}
        </Link>

        <Link
          to={`/melden/`}
          className='comment-card__menu'
          state={{
            link: `https://app.lokalspende.org/neuste-kommentare/${props.item._id}`,
          }}
        >
          <img src={require('./img/three-dots.svg')} alt='' />
        </Link>
      </div>

      <p className='comment'>{props.item.commentText}</p>

      <div className='comment-card__actions'>
        <div className='comment-card__votes'>
          <div className='comment-card__vote'>
            <img
              onClick={upvote}
              src={upvoteimage}
              className='voting-button'
              id='upvotebutton'
              alt='Upvote'
            />
            <Link
              className='linkblack'
              to={'/upvoter-comments/' + props.item._id}
            >
              <p id='upvotes' className='voting-counter-upanddown'>
                {upvotecounter}
              </p>
            </Link>
          </div>

          <div className='comment-card__vote'>
            <img
              onClick={downvote}
              src={downvoteimage}
              className='voting-button'
              id='downvotebutton'
              alt='Downvote'
            />
            <Link
              className='linkblack'
              to={'/downvoter-comments/' + props.item._id}
            >
              <p id='downvotes' className='voting-counter-upanddown'>
                {downvotecounter}
              </p>
            </Link>
          </div>
        </div>

        <button
          type='button'
          className='share-trigger'
          onClick={() => setShareOpen(true)}
          aria-label='Share'
        >
          <img src={require('./img/share.svg')} className='share-button-comment' alt='' />
        </button>
      </div>

      <ShareSheet
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        url={`/neuste-kommentare/${Id || props.item.postId}`}
      />
    </div>
  );
};
