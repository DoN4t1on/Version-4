const mongoose = require('mongoose');

const downvoteCommentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  expId: { type: mongoose.Schema.Types.ObjectId, required: true },
  dateTime: { type: Date },
  isIncognito: { type: Boolean, default: false },
}, { timestamps: true });

downvoteCommentSchema.index({ userId: 1, expId: 1 }, { unique: true });

module.exports = mongoose.model('downvoteComment', downvoteCommentSchema);
