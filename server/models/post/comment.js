const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },

  commentText: { type: String, required: true, trim: true, maxlength: 5000 },

  likes: { type: Number, default: 0 },
  upVote: { type: Number, default: 0 },
  downVote: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema, 'comments');
