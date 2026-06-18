
import { NavbarBottom } from "./NavbarBottom";
import { Comment } from "./Comment";
import { Link, useParams, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { localStorageData } from './services/auth/localStorageData';
import ErrorService from './services/formatError/ErrorService';
import userServices from './services/httpService/userAuth/userServices';
import { useMutation, useQuery } from 'react-query';
import { toast } from 'react-toastify';

export const Comments = () => {
  const navigate = useNavigate();
  const { Id } = useParams();

  const UploadNewComment = useMutation(
    (NewComment) =>
      userServices.commonPostService('/post/uploadComment', NewComment),
    {
      onError: (error) => {
        toast.error(ErrorService.uniformError(error));
      },
      onSuccess: (res) => {
        getComments.refetch();
      },
    }
  );

  const [allComments, setallComments] = React.useState([]);

  const redirectToLogin = () => {
    navigate('/dein-profil', { replace: true });
    toast.error('Erstellen Sie ein Profil um fortzufahren');
  };

  const getComments = useQuery(
    'getCommentshere',
    () => userServices.commonGetService(`/post/getComments/${Id}`),
    {
      refetchOnWindowFocus: false,
      onError: (error) => {
        toast.error(ErrorService.uniformError(error));
      },
      onSuccess: (res) => {
        setallComments(res.data.data);
      },
    }
  );
  const [amount, setAmount] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (localStorageData('_id')) {
      UploadNewComment.mutate({
        userId: localStorageData('_id'),
        postId: Id,
        commentText: amount,
      });
      setAmount('');
    } else {
      redirectToLogin();
    }
  };

  return (
    <div>

      <div className='casual-header-div '>
        <button className='back-button-button' onClick={() => navigate(-1)}>
          <img
            className='back-button-icon'
            src={require('./img/arrow-left-short.svg')}
          />
        </button>
        <h4 className=' headline headline-with-back-button '>
          {' '}
          Kommentare
        </h4>
      </div>


      <div className='comment-menu'>
        {allComments.map((item) => (
          <Comment item={item} key={item._id} />
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <div className='comment-bar'>
          <input
            value={amount}
            type='text'
            maxLength='300'
            className='comment-input'
            placeholder='Kommentieren'
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <button type='submit' className='btn btn-ghost-light comment-button'>
            <img
              className='comment-image'
              src={require('./img/send-comment.svg')}
            />
          </button>
        </div>
      </form>
      <NavbarBottom
        classstart='under-navitem-selected'
        classsearch='under-navitem-unselected'
        classactivity='under-navitem-unselected'
        classprofile='under-navitem-unselected'
      />
    </div>
  );
};
