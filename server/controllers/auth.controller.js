const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, ForgetPassword, EmailVerify } = require('../models');
const { sendEmail } = require('../services/emailService');
const {
  verifyFacebookToken,
  verifyGoogleCredential,
} = require('../services/socialAuthService');
const { requireObjectId } = require('../services/requestValidation');
const { v4: uuidv4 } = require('uuid');

const serializeUser = (user, token) => {
  const safeUser = typeof user.toObject === 'function' ? user.toObject() : { ...user };
  delete safeUser.pass;
  if (token) safeUser.token = token;
  return safeUser;
};

const signUserToken = (user) => jwt.sign(
  { user_id: user._id, email: user.email },
  process.env.TOKEN_KEY,
  { expiresIn: process.env.TOKEN_Time || '1h' }
);

const findOrCreateSocialUser = async ({ provider, id, email, fname, pic }) => {
  const providerField = provider === 'google' ? 'googleId' : 'fbId';
  let user = await User.findOne({
    $or: [{ email }, { [providerField]: id }],
  });

  if (user && (user.email !== email || user[providerField] !== id)) {
    const error = new Error('An account already exists with this email address');
    error.status = 409;
    throw error;
  }

  if (!user) {
    const lastRecord = await User.findOne().sort({ counterId: -1 }).limit(1);
    const firstCounter = Number(process.env.MONGO_Counter || 1);
    user = await User.create({
      fname,
      email,
      pic: pic || undefined,
      [providerField]: id,
      verify: 'yes',
      registeredBy: provider,
      username: uuidv4(),
      counterId: lastRecord?.counterId ? lastRecord.counterId + 1 : firstCounter,
    });
  }

  return serializeUser(user, signUserToken(user));
};

const forgetPasswordVerify = async (req, res) => {

  const { uniqueId } = req.params;

  try {
    const resetId = requireObjectId(uniqueId, 'uniqueId');
    const Record_Exist = await ForgetPassword.findOne({
      _id: resetId,
    });

    if (Record_Exist) {
      const publicUrl = new URL(process.env.websiteLink || 'http://localhost:1234');
      publicUrl.pathname = `/updatepass/${encodeURIComponent(Record_Exist.email)}/${uniqueId}`;
      return res.redirect(302, publicUrl.toString());
    } else {
      return res.status(404).json({ message: 'Password reset request not found' });
    }
  } catch (err) {
    return res.status(400).json({ message: 'Etwas lief schief' });
  }
};

const login = async (req, res) => {
  try {
    const { username, pass } = req.body;
    if (!(username && pass)) {
      return res.status(400).json({ message: 'Alle Eingabefelder werden benötigt' });
    }
    const user = await User.findOne({
      $or: [
        {
          email: username.toLowerCase(),
        },
        {
          username: username.toLowerCase(),
        },
      ],
    });

    if (user && user.pass && (await bcrypt.compare(pass, user.pass))) {
      if (user.verify == 'no') {
        return res
          .status(400)
          .json({ message: 'Sie müssen ihren Account erst bestätigen' });
      }
      const token = jwt.sign(
        { user_id: user._id, username },
        process.env.TOKEN_KEY,
        {
          expiresIn: process.env.TOKEN_Time,
        }
      );

      res.status(200).json({ status: true, data: serializeUser(user, token) });
    } else {
      res.status(400).json({ message: 'Ungültige Anmeldeinformation' });
    }
  } catch (err) {

    return res.status(400).json({ message: 'Etwas lief schief' });
  }
};

const registerByFb = async (req, res) => {
  try {
    const profile = await verifyFacebookToken(req.body.accessToken);
    const user = await findOrCreateSocialUser({ ...profile, provider: 'facebook' });
    return res.status(200).json({ status: true, data: user });
  } catch (err) {
    console.error('Facebook login failed:', err.message);
    return res.status(err.status || 401).json({ message: err.message });
  }
};

const registerByGoogle = async (req, res) => {
  try {
    const profile = await verifyGoogleCredential(req.body.credential);
    const user = await findOrCreateSocialUser({ ...profile, provider: 'google' });
    return res.status(200).json({ status: true, data: user });
  } catch (err) {
    console.error('Google login failed:', err.message);
    return res.status(err.status || 401).json({ message: err.message });
  }
};

const registerByEmail = async (req, res) => {
  try {
    const { email, pass, username } = req.body;
    if (!(email && pass && username)) {
      return res
        .status(400)
        .json({ message: 'Alle Eingabefelder werden benötigt' });
    }

    const normalizedEmail = email.toLowerCase();
    const normalizedUsername = username.toLowerCase();
    let encryptedpass = await bcrypt.hash(pass, 10);
    const oldUser = await User.findOne({
      $or: [
        {
          email: normalizedEmail,
        },
        {
          username: normalizedUsername,
        },
      ],
    });

    if (oldUser) {
      return res.status(400).json({
        status: false,
        data: 'Der Nutzer existiert bereits',
        message: 'Der Nutzer existiert bereits',
      });
    } else {
      const lastRecord = await User.findOne().sort({ _id: -1 }).limit(1);
      const firstCounter = Number(process.env.MONGO_Counter || 1);
      const previousCounter = Number(lastRecord?.counterId);
      const counterId = Number.isFinite(previousCounter) && previousCounter > 0
        ? previousCounter + 1
        : firstCounter;

      const user = await User.create({
        username: normalizedUsername,
        email: normalizedEmail,
        fname: username,
        registeredBy: 'email',
        pass: encryptedpass,
        counterId: counterId,
      });
      const token = jwt.sign(
        { user_id: user._id, email: normalizedEmail },
        process.env.TOKEN_KEY,
        {
          expiresIn: process.env.TOKEN_Time,
        }
      );
      user.token = token;

      const VerifiedEmial = await EmailVerify.create({
        email: normalizedEmail,
      });

      var emailParameters = {
        username,
        email: normalizedEmail,

        uniquelink:
          process.env.websiteLink +
          'api/email/verify/' +
          normalizedEmail +
          '/uniqueid/' +
          VerifiedEmial._id,
      };

      let emailToSend = [
        {
          Email: email,
        },
      ];
      sendEmail(
        emailToSend,
        'Willkommen bei Lokalspende',
        emailParameters,
        'veerify_Email_Body'
      );

      return res.status(200).json({ status: true, data: serializeUser(user) });
    }
  } catch (err) {

    return res.status(400).json({ message: 'Etwas lief schief' });
  }
};

const CheckEmailOrUsername = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ message: 'Alle Eingabefelder werden benötigt' });
    }
    const oldUser = await User.findOne({
      $or: [
        {
          email: username,
        },
        {
          username: username,
        },
      ],
    });
    if (oldUser) {
      return res.status(400).json({
        status: false,
        message: 'userName/Email Exist',
        data: { userExist: true },
      });
    } else {
      return res.status(200).json({ status: true, data: { userExist: false } });
    }
  } catch (err) {

    return res.status(400).json({ message: 'Etwas lief schief' });
  }
};

const updateUserInfo = async (req, res) => {
  try {
    let pic = req.files != '' ? req.files[0].filename : '';
    const { lat, long, fname, location, link, desc } = req.body;
    const userId = requireObjectId(req.user.user_id, 'authenticated user');

    req.body.loc = {
      type: 'Point',
      coordinates: [parseFloat(req.body.long), parseFloat(req.body.lat)],
    };










    let update;

    if (pic) {
      update = {
        link: link,
        description: desc,
        address: location,
        fname: fname,
        pic: pic,
        loc: req.body.loc,
      };
    } else {
      update = {
        link: link,
        description: desc,
        address: location,
        fname: fname,

        loc: req.body.loc,
      };
    }


    await User.findOneAndUpdate({ _id: userId }, update);

    let updatedUser = await User.findOne({ _id: userId });

    return res.status(200).json({ status: true, data: updatedUser });
  } catch (err) {
    return res.status(400).json({ message: 'Etwas lief schief' });
  }
};

const getSingleUserDetail = async (req, res) => {
  try {
    const userId = requireObjectId(req.params.userId, 'userId');

    let updatedUser = await User.findOne({ _id: userId }).select(
      '-pass'
    );

    return res.status(200).json({ status: true, data: updatedUser });
  } catch (err) {
    return res.status(400).json({ message: 'Etwas lief schief' });
  }
};

const updateUserPassword = async (req, res) => {
  try {
    const { email, pass, uniqueId } = req.body;
    if (!(email && pass)) {
      return res.status(400).json({ message: 'Alle Eingabefelder werden benötigt' });
    }
    const user = await User.findOne({
      email,
    });

    if (user) {
      const resetId = requireObjectId(uniqueId, 'uniqueId');
      const Record_Exist = await ForgetPassword.findOne({
        $and: [
          {
            email: email,
          },
          {
            _id: resetId,
          },
        ],
      });

      if (Record_Exist) {
        let encryptedpass = await bcrypt.hash(pass, 10);

        const filter = { email: email };
        const update = { pass: encryptedpass };

        await User.findOneAndUpdate(filter, update);

        await ForgetPassword.deleteOne({
          email: email,
        });

        return res
          .status(200)
          .json('Ihr Passwort wurde geändert.');
      } else {
        return res
          .status(400)

          .json({
            message: 'Sie dürfen das Passwort nicht ändern. Wir haben Ihnen eine Email geschickt.',
          });
      }
    } else {
      return res.status(400).json({
        message: 'Sie dürfen das Passwort nicht ändern. Wir haben Ihnen eine Email geschickt.',
      });
    }
  } catch (err) {

    return res.status(400).json({ message: 'Etwas lief schief' });
  }
};

module.exports = {
  forgetPasswordVerify,
  login,
  registerByFb,
  registerByGoogle,
  registerByEmail,
  updateUserInfo,
  CheckEmailOrUsername,
  updateUserPassword,
  getSingleUserDetail,
};
