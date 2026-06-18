const mongoose = require('mongoose');

const upvoteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, required: true },
  dateTime: { type: Date },
  isIncognito: { type: Boolean, default: false },
}, { timestamps: true });

upvoteSchema.index({ userId: 1, postId: 1 }, { unique: true });

module.exports = mongoose.model('upvote', upvoteSchema);
