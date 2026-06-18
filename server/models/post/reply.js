const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  commentId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  isIncognito: { type: Boolean, default: false },
  replyText: { type: String, required: true, trim: true, maxlength: 5000 },
  timeZone: { type: String },
  dateTime: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Reply', replySchema, 'replies');
