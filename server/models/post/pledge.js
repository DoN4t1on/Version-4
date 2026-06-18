const mongoose = require('mongoose');

const pledgeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, required: true },

  amount: { type: Number, required: true, min: 0 },
  dateTime: { type: Date },
  isIncognito: { type: Boolean, default: false },
}, { timestamps: true });

pledgeSchema.index({ userId: 1, postId: 1 }, { unique: true });

module.exports = mongoose.model('Pledge', pledgeSchema, 'pledges');
