const mongoose = require('mongoose');

exports.connect = async () => {
  const MONGO_URI =
    process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/localdonation';

  await mongoose.connect(MONGO_URI);
};

exports.disconnect = () => mongoose.disconnect();
