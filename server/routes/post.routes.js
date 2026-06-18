const { Router } = require('express');

const upload = require('../middleware/upload');
const auth = require('../middleware/auth');
const checkIsAdmin = require('../middleware/checkIsAdmin');
module.exports = (PostController) => {
  const postRouter = new Router();

  postRouter.post(
    '/uploadPost',
    auth,
    upload.array('pics'),
    PostController.uploadPost
  );

  postRouter.post(
    '/uploadComment',
    auth,
    PostController.uploadComment
  );

  postRouter.post(
    '/bidOnPost',
    auth,
    PostController.bidOnPost
  );

  postRouter.post(
    '/upVote',
    auth,
    PostController.upvoteOnPost
  );

  postRouter.post(
    '/downVote',
    auth,
    PostController.downvoteOnPost
  );

  postRouter.post(
    '/upVoteonComment',
    auth,
    PostController.upvoteOnComment
  );

  postRouter.post(
    '/downVoteonComment',
    auth,
    PostController.downvoteOnComment
  );


  postRouter.get(
    '/getComments/:Id',

    PostController.getComments
  );

  postRouter.get(
    '/getBidders/:Id',

    PostController.getbidder
  );

  postRouter.get(
    '/getUpvoterList/:Id',

    PostController.getUpvoterList
  );

  postRouter.get(
    '/getDownvoterList/:Id',

    PostController.getDownvoterList
  );


  postRouter.get(
    '/getUpvoterListComments/:Id',

    PostController.getUpvoterListComments
  );

  postRouter.get(
    '/getDownvoterListComments/:Id',

    PostController.getDownvoterListComments
  );

  postRouter.post(
    '/uploadReply',
    auth,
    PostController.uploadReply
  );

  postRouter.post(
    '/sendReport',

    PostController.sendReport
  );

  postRouter.get(
    '/getAllPost/:counter/:lat/:long',

    PostController.getAllPosts
  );

  postRouter.get(
    '/getAllMostPopularPost/:counter',

    PostController.getAllMostPopularPost
  );

  postRouter.get(
    '/getOneSuggestion/:Id',

    PostController.getOneSuggestion
  );

  postRouter.get(
    '/getApproveSuggestion/:Id',

    PostController.getOneSuggestion
  );

  postRouter.get(
    '/verify-post/:Id',
    auth,
    checkIsAdmin,
    PostController.approvePostByadmin
  );

  return postRouter;
};
