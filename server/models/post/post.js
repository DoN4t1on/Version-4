const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true, index: true },

  title: { type: String, required: true, trim: true, maxlength: 160 },

  status: { type: Boolean, default: false },

  description: { type: String, required: true, trim: true, maxlength: 5000 },
  pic: { type: String },
  comments: { type: Number, default: 0 },
  bidder: { type: Number, default: 0 },

  upVote: { type: Number, default: 0 },
  downVote: { type: Number, default: 0 },

  loc: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: (coordinates) => coordinates.length === 2,
        message: 'Location must contain longitude and latitude',
      },
    },
  },
}, { timestamps: true });

postSchema.index({ loc: '2dsphere' });

module.exports = mongoose.model('Post', postSchema, 'posts');
