const mongoose = require('mongoose');

const upvoteCommentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  expId: { type: mongoose.Schema.Types.ObjectId, required: true },
  dateTime: { type: Date },
  isIncognito: { type: Boolean, default: false },
}, { timestamps: true });

upvoteCommentSchema.index({ userId: 1, expId: 1 }, { unique: true });

module.exports = mongoose.model('upvoteComment', upvoteCommentSchema);
