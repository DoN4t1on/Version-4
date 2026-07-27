
import { NavbarBottom } from "./NavbarBottom";
import { Comment } from "./Comment";
import { useParams, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { localStorageData } from './services/auth/localStorageData';
import ErrorService from './services/formatError/ErrorService';
import userServices from './services/httpService/userAuth/userServices';
import { useMutation, useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { PageHeader } from './components/layout/PageHeader';
import { AppPage } from './components/layout/AppPage';

export const Comments = () => {
  const { t } = useTranslation();
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
    toast.error(t('toast.loginRequired'));
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
    <AppPage>
      <PageHeader title={t('comments.title')} />


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
            placeholder={t('comments.placeholder')}
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
      <NavbarBottom showInfo={false} />
    </AppPage>
  );
};
