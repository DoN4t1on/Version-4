const { sendEmail } = require('../services/emailService');
const {
  Post,
  Comment,
  Reply,
  Pledge,
  Upvote,
  Downvote,
  UpvoteComment,
  DownvoteComment,
} = require('../models');

const moment = require('moment-timezone');
const {
  requireFiniteNumber,
  requireObjectId,
  requireString,
} = require('../services/requestValidation');

const errorResponse = (res, error) => {
  if (!error.status || error.status >= 500) {
    console.error(error);
  }
  return res.status(error.status || 500).json({
    message: error.status ? error.message : 'Etwas lief schief',
  });
};

const requestDate = (value, timeZone) => {
  const date = timeZone ? moment.tz(value || new Date(), timeZone) : moment(value || new Date());
  if (!date.isValid()) {
    const error = new Error('dateTime must be a valid date');
    error.status = 422;
    throw error;
  }
  return date.toDate();
};

const uploadPost = async (req, res) => {
  try {
    const longitude = requireFiniteNumber(req.body.long, 'long', { min: -180, max: 180 });
    const latitude = requireFiniteNumber(req.body.lat, 'lat', { min: -90, max: 90 });
    const post = await Post.create({
      userId: requireObjectId(req.user.user_id, 'authenticated user'),
      title: requireString(req.body.title, 'title', { max: 160 }),
      description: requireString(req.body.description, 'description', { max: 5000 }),
      pic: req.files?.[0]?.filename || '',
      status: true,
      loc: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
    });

    var emailParameters = {
      post: post._id,
    };

    let emailToSend = [
      {
        Email: 'it@LocalDonation.org',
      },
    ];

    sendEmail(
      emailToSend,
      'New Post to Approve',
      emailParameters,
      'Post_Approve'
    );

    return res.status(201).json({ status: true, data: post });
  } catch (err) {
    return errorResponse(res, err);
  }
};

const uploadComment = async (req, res) => {
  try {
    const postId = requireObjectId(req.body.postId, 'postId');
    const userId = requireObjectId(req.user.user_id, 'authenticated user');
    const commentText = requireString(req.body.commentText, 'commentText', { max: 5000 });

    const post = await Post.findByIdAndUpdate(postId, { $inc: { comments: 1 } });
    if (!post) {
      const error = new Error('Post not found');
      error.status = 404;
      throw error;
    }

    const ex = await Comment.create({
      userId,
      postId,
      commentText,
    });
    return res.status(201).json({ status: true, data: ex });
  } catch (err) {
    return errorResponse(res, err);
  }
};

const approvePostByadmin = async (req, res) => {
  try {
    const postId = requireObjectId(req.params.Id, 'Id');
    const doc = await Post.findByIdAndUpdate(
      postId,
      { $set: { status: true } },
      { new: true, runValidators: true }
    );
    if (!doc) return res.status(404).json({ message: 'Post not found' });

    return res.status(200).json({ status: true, data: doc });
  } catch (err) {
    return errorResponse(res, err);
  }
};

const bidOnPost = async (req, res) => {
  try {
    const userId = requireObjectId(req.user.user_id, 'authenticated user');
    const postId = requireObjectId(req.body.postId, 'postId');
    const amount = requireFiniteNumber(req.body.amount, 'amount', { min: 0.01 });
    const dateTime = requestDate(req.body.dateTime, req.body.timeZone);

    let prePledge = await Pledge.findOne({
      $and: [
        {
          postId,
        },
        {
          userId,
        },
      ],
    });

    if (prePledge) {
      const doc = await Pledge.findByIdAndUpdate(
        prePledge._id,
        { $inc: { amount } },
        { new: true, runValidators: true }
      );

      return res.status(200).json({ status: true, data: doc, isNew: false });
    } else {
      const post = await Post.findByIdAndUpdate(postId, { $inc: { bidder: 1 } });
      if (!post) return res.status(404).json({ message: 'Post not found' });

      const ex = await Pledge.create({
        userId,
        postId,
        amount,
        dateTime,
        timeZone: req.body.timeZone,
      });
      return res.status(201).json({ status: true, data: ex, isNew: true });
    }
  } catch (err) {
    return errorResponse(res, err);
  }
};

const upvoteOnPost = async (req, res) => {
  try {
    const userId = requireObjectId(req.user.user_id, 'authenticated user');
    const postId = requireObjectId(req.body.postId, 'postId');
    if (!(await Post.exists({ _id: postId }))) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const vote = await Upvote.findOneAndDelete({ postId, userId });

    if (vote) {
      await Post.findByIdAndUpdate(postId, { $inc: { upVote: -1 } });
    } else {
      const oppositeVote = await Downvote.findOneAndDelete({ postId, userId });
      await Upvote.create({
        userId,
        postId,
        dateTime: requestDate(req.body.dateTime, req.body.timeZone),
        timeZone: req.body.timeZone,
      });
      const counters = oppositeVote ? { upVote: 1, downVote: -1 } : { upVote: 1 };
      const post = await Post.findByIdAndUpdate(postId, { $inc: counters });
      if (!post) return res.status(404).json({ message: 'Post not found' });
    }

    const refreshpost = await getSinlePostById(postId);

    return res.status(200).json({ status: true, data: refreshpost });
  } catch (err) {
    return errorResponse(res, err);
  }
};

const downvoteOnPost = async (req, res) => {
  try {
    const userId = requireObjectId(req.user.user_id, 'authenticated user');
    const postId = requireObjectId(req.body.postId, 'postId');
    if (!(await Post.exists({ _id: postId }))) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const vote = await Downvote.findOneAndDelete({ postId, userId });

    if (vote) {
      await Post.findByIdAndUpdate(postId, { $inc: { downVote: -1 } });
    } else {
      const oppositeVote = await Upvote.findOneAndDelete({ postId, userId });
      await Downvote.create({
        userId,
        postId,
        dateTime: requestDate(req.body.dateTime, req.body.timeZone),
        timeZone: req.body.timeZone,
      });
      const counters = oppositeVote ? { upVote: -1, downVote: 1 } : { downVote: 1 };
      const post = await Post.findByIdAndUpdate(postId, { $inc: counters });
      if (!post) return res.status(404).json({ message: 'Post not found' });
    }
    const refreshpost = await getSinlePostById(postId);

    return res.status(200).json({ status: true, data: refreshpost });
  } catch (err) {
    return errorResponse(res, err);
  }
};

async function getCommentById(Id) {
  const commentId = requireObjectId(Id, 'Id');
  let Fetch = await Comment.aggregate([
    {
      $match: { _id: commentId },
    },

    { $sort: { _id: 1 } },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $lookup: {
        from: 'upvotecomments',
        localField: '_id',
        foreignField: 'expId',
        as: 'upvotecomments',
      },
    },
    {
      $lookup: {
        from: 'downvotecomments',
        localField: '_id',
        foreignField: 'expId',
        as: 'downvotecomments',
      },
    },
  ]);

  return Fetch;
}

const getComments = async (req, res) => {
  try {
    const postId = requireObjectId(req.params.Id, 'Id');

    let Fetch = await Comment.aggregate([
      {
        $match: { postId },
      },

      { $sort: { _id: 1 } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $lookup: {
          from: 'upvotecomments',
          localField: '_id',
          foreignField: 'expId',
          as: 'upvotecomments',
        },
      },
      {
        $lookup: {
          from: 'downvotecomments',
          localField: '_id',
          foreignField: 'expId',
          as: 'downvotecomments',
        },
      },
    ]);

    return res.status(200).json({ status: true, data: Fetch });
  } catch (err) {
    return errorResponse(res, err);
  }
};

const getbidder = async (req, res) => {
  try {
    const postId = requireObjectId(req.params.Id, 'Id');

    let Fetch = await Pledge.aggregate([
      {
        $match: { postId },
      },

      { $sort: { _id: -1 } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },

      { $unwind: '$user' },
    ]);

    return res.status(200).json({ status: true, data: Fetch });
  } catch (err) {
    return errorResponse(res, err);
  }
};

const getUpvoterList = async (req, res) => {
  try {
    const postId = requireObjectId(req.params.Id, 'Id');

    let Fetch = await Upvote.aggregate([
      {
        $match: { postId },
      },

      { $sort: { _id: -1 } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },

      { $unwind: '$user' },
    ]);

    return res.status(200).json({ status: true, data: Fetch });
  } catch (err) {
    return errorResponse(res, err);
  }
};

const getUpvoterListComments = async (req, res) => {
  try {
    const expId = requireObjectId(req.params.Id, 'Id');

    let Fetch = await UpvoteComment.aggregate([
      {
        $match: { expId },
      },

      { $sort: { _id: -1 } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },

      { $unwind: '$user' },
    ]);
    return res.status(200).json({ status: true, data: Fetch });
  } catch (err) {
    return errorResponse(res, err);
  }
};

const getDownvoterList = async (req, res) => {
  try {
    const postId = requireObjectId(req.params.Id, 'Id');

    let Fetch = await Downvote.aggregate([
      {
        $match: { postId },
      },

      { $sort: { _id: -1 } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },

      { $unwind: '$user' },
    ]);

    return res.status(200).json({ status: true, data: Fetch });
  } catch (err) {
    return errorResponse(res, err);
  }
};

const getDownvoterListComments = async (req, res) => {
  try {
    const expId = requireObjectId(req.params.Id, 'Id');

    let Fetch = await DownvoteComment.aggregate([
      {
        $match: { expId },
      },

      { $sort: { _id: -1 } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },

      { $unwind: '$user' },
    ]);

    return res.status(200).json({ status: true, data: Fetch });
  } catch (err) {
    return errorResponse(res, err);
  }
};

const uploadReply = async (req, res) => {
  try {
    const commentId = requireObjectId(req.body.commentId, 'commentId');
    const userId = requireObjectId(req.user.user_id, 'authenticated user');
    const replyText = requireString(req.body.replyText, 'replyText', { max: 5000 });
    if (!(await Comment.exists({ _id: commentId }))) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const ex = await Reply.create({
      userId,
      isIncognito: Boolean(req.body.isIncognito),
      commentId,
      replyText,
      timeZone: req.body.timeZone,
      dateTime: requestDate(req.body.dateTime, req.body.timeZone),
    });

    return res.status(201).json({ status: true, data: ex });
  } catch (err) {
    return errorResponse(res, err);
  }
};

const getAllMostPopularPost = async (req, res) => {
  try {
    let Fetch = await Post.aggregate([
      {
        $match: { status: true },
      },
      { $sort: { upVote: -1 } },

      {
        $lookup: {
          from: 'upvotes',
          localField: '_id',
          foreignField: 'postId',
          as: 'upvotes',
        },
      },
      {
        $lookup: {
          from: 'downvotes',
          localField: '_id',
          foreignField: 'postId',
          as: 'downvotes',
        },
      },

      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },

      { $unwind: '$user' },

      { $unset: ['user.pass'] },
    ]);

    return res.status(200).json({ status: true, data: Fetch });
  } catch (err) {

    return res.status(400).json({ message: 'Etwas lief schief' });
  }
};

async function getSinlePostById(Id) {
  const postId = requireObjectId(Id, 'Id');
  let Fetch = await Post.aggregate([
    {
      $match: { _id: postId },
    },
    { $sort: { _id: -1 } },

    {
      $lookup: {
        from: 'upvotes',
        localField: '_id',
        foreignField: 'postId',
        as: 'upvotes',
      },
    },
    {
      $lookup: {
        from: 'downvotes',
        localField: '_id',
        foreignField: 'postId',
        as: 'downvotes',
      },
    },

    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      },
    },

    { $unwind: '$user' },

    { $unset: ['user.pass'] },
  ]);

  return Fetch;
}



async function getLatestPostsWithoutGeoLocation(req, res) {

  try {
    let Fetch = await Post.aggregate([
      {
        $match: { status: true },
      },
      { $sort: { _id: -1 } },

      { $skip: parseInt(req.params.counter) },
      { $limit: 1 },

      {
        $lookup: {
          from: 'upvotes',
          localField: '_id',
          foreignField: 'postId',
          as: 'upvotes',
        },
      },
      {
        $lookup: {
          from: 'downvotes',
          localField: '_id',
          foreignField: 'postId',
          as: 'downvotes',
        },
      },

      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },

      { $unwind: '$user' },

      { $unset: ['user.pass'] },
    ]);

    return res.status(200).json({ status: true, data: Fetch });
  } catch (err) {

    return res.status(400).json({ message: 'Etwas lief schief' });
  }
}

async function getWithGeolocation(req, res) {

  try {
    let Fetch = await Post.aggregate([

      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [
              parseFloat(req.params.long),
              parseFloat(req.params.lat),
            ],
          },
          distanceField: 'dist.calculated',
          spherical: true,
        },
      },

      {
        $match: { status: true },
      },
      { $skip: parseInt(req.params.counter) },
      { $limit: 1 },

      {
        $lookup: {
          from: 'upvotes',
          localField: '_id',
          foreignField: 'postId',
          as: 'upvotes',
        },
      },
      {
        $lookup: {
          from: 'downvotes',
          localField: '_id',
          foreignField: 'postId',
          as: 'downvotes',
        },
      },

      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },

      { $unwind: '$user' },

      { $unset: ['user.pass'] },
    ]);

    return res.status(200).json({ status: true, data: Fetch });
  } catch (err) {

    return res.status(400).json({ message: 'Etwas lief schief' });
  }
}

const getAllPosts = async (req, res) => {
  try {
    if (req.params.lat == 'false') {
      getLatestPostsWithoutGeoLocation(req, res);
    } else {
      getWithGeolocation(req, res);
    }
  } catch (err) {

    return res.status(400).json({ message: 'Etwas lief schief' });
  }
};

const getOneSuggestion = async (req, res) => {
  try {
    const postId = requireObjectId(req.params.Id, 'Id');
    let Fetch = await Post.aggregate([
      {
        $match: { _id: postId },
      },

      {
        $lookup: {
          from: 'upvotes',
          localField: '_id',
          foreignField: 'postId',
          as: 'upvotes',
        },
      },
      {
        $lookup: {
          from: 'downvotes',
          localField: '_id',
          foreignField: 'postId',
          as: 'downvotes',
        },
      },

      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },

      { $unwind: '$user' },

      { $unset: ['user.pass'] },
    ]);

    return res.status(200).json({ status: true, data: Fetch });
  } catch (err) {
    return errorResponse(res, err);
  }
};

const sendReport = async (req, res) => {
  try {
    var emailParameters = {
      post: req.body.link,
    };

    let emailToSend = [
      {
        Email: 'it@LocalDonation.org',
      },
    ];

    sendEmail(
      emailToSend,
      'User Response ',
      emailParameters,
      'Report_Email_Body'
    );

    return res.status(200).json({ status: true });
  } catch (err) {
    return res.status(400).json({ message: 'Etwas lief schief' });
  }
};

const upvoteOnComment = async (req, res) => {
  try {
    const userId = requireObjectId(req.user.user_id, 'authenticated user');
    const expId = requireObjectId(req.body.expId, 'expId');
    if (!(await Comment.exists({ _id: expId }))) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    const vote = await UpvoteComment.findOneAndDelete({ expId, userId });

    if (vote) {
      await Comment.findByIdAndUpdate(expId, { $inc: { upVote: -1 } });
    } else {
      const oppositeVote = await DownvoteComment.findOneAndDelete({ expId, userId });
      await UpvoteComment.create({
        userId,
        expId,
        dateTime: requestDate(req.body.dateTime, req.body.timeZone),
        timeZone: req.body.timeZone,
      });
      await Comment.findByIdAndUpdate(expId, {
        $inc: oppositeVote ? { upVote: 1, downVote: -1 } : { upVote: 1 },
      });
    }

    const refreshpost = await getCommentById(expId);
    return res.status(200).json({ status: true, data: refreshpost });
  } catch (err) {
    return errorResponse(res, err);
  }
};

const downvoteOnComment = async (req, res) => {
  try {
    const userId = requireObjectId(req.user.user_id, 'authenticated user');
    const expId = requireObjectId(req.body.expId, 'expId');
    if (!(await Comment.exists({ _id: expId }))) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    const vote = await DownvoteComment.findOneAndDelete({ expId, userId });

    if (vote) {
      await Comment.findByIdAndUpdate(expId, { $inc: { downVote: -1 } });
    } else {
      const oppositeVote = await UpvoteComment.findOneAndDelete({ expId, userId });
      await DownvoteComment.create({
        userId,
        expId,
        dateTime: requestDate(req.body.dateTime, req.body.timeZone),
        timeZone: req.body.timeZone,
      });
      await Comment.findByIdAndUpdate(expId, {
        $inc: oppositeVote ? { upVote: -1, downVote: 1 } : { downVote: 1 },
      });
    }

    const refreshpost = await getCommentById(expId);

    return res.status(200).json({ status: true, data: refreshpost });
  } catch (err) {
    return errorResponse(res, err);
  }
};

module.exports = {
  uploadPost,
  bidOnPost,
  getAllPosts,
  getAllMostPopularPost,
  uploadComment,
  uploadReply,
  getComments,
  getbidder,
  upvoteOnPost,
  downvoteOnPost,
  getUpvoterList,
  getDownvoterList,

  getUpvoterListComments,
  getDownvoterListComments,
  getOneSuggestion,
  sendReport,
  upvoteOnComment,
  downvoteOnComment,
  approvePostByadmin,
};
