const { User, ForgetPassword, EmailVerify } = require('../models');
const { sendEmail } = require('../services/emailService');
const { ThanksEmailBody } = require('../services/emailTemplates');
const { requireObjectId } = require('../services/requestValidation');

const applyForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    let userEmail = email.toLowerCase();
    const user = await User.findOne({
      email: userEmail,
      registeredBy: 'email',
    });

    if (user) {
      const passRecoed = await ForgetPassword.create({
        email: userEmail,
      });

      const websiteLink = (process.env.websiteLink || 'http://localhost:1234').replace(/\/$/, '');
      let uniquelink =
        `${websiteLink}/updatepass/${encodeURIComponent(userEmail)}/${passRecoed._id}`;

      var emailParameters = {
        fname: user.fname,
        userEmail,

        uniquelink: uniquelink,
      };

      let emailToSend = [
        {
          Email: userEmail,
        },
      ];

      sendEmail(
        emailToSend,
        'Forget Password',
        emailParameters,
        'ForgetPass_Email_Body'
      );
      return res.status(200).json('Eine Email wurde gesendet');
    } else {
      return res.status(400).json({ message: 'Dieser Nutzer existiert nicht' });
    }
  } catch (err) {
    return res.status(400).json({ message: 'Etwas lief schief' });
  }
};

const verifyEmail = async (req, res) => {
  const { email, uniqueId } = req.params;

  try {
    const verificationId = requireObjectId(uniqueId, 'uniqueId');
    const Record_Exist = await EmailVerify.findOne({
      $and: [
        {
          email: email,
        },
        {
          _id: verificationId,
        },
      ],
    });

    if (Record_Exist) {
      const filter = { email: email };
      const update = { verify: 'yes' };

      let doc = await User.findOneAndUpdate(filter, update);

      var emailParameters = {
        email,
        fname: doc.fname,
      };

      let emailToSend = [
        {
          Email: email,
        },
      ];
      res.send(ThanksEmailBody);
    } else {
      res.send('Kein Eintrag gefunden');
    }
  } catch (err) {
    return res.status(400).json({ message: 'Etwas lief schief' });
  }
};

module.exports = {
  applyForgotPassword,
  verifyEmail,
};
