const Mailjet = require('node-mailjet');

const {
  forgetEmailBody,
  verifyEmailBody,
  welcomeEmailBody,
  Report_Email_Body,
  Post_Approve,
} = require('./emailTemplates');

async function sendEmail(emailToSend, subject, data, Email_templete) {
  try {
    if (!process.env.MAIL_JET_KEY1 || !process.env.MAIL_JET_KEY2) {
      throw new Error('Mailjet credentials are not configured');
    }

    const mailjet = Mailjet.apiConnect(
      process.env.MAIL_JET_KEY1,
      process.env.MAIL_JET_KEY2
    );
    var Email_Templete_Name = ``;
    if (Email_templete == 'veerify_Email_Body') {
      Email_Templete_Name = await verifyEmailBody(data);
    } else if (Email_templete == 'Welcome_Email_Body') {
      Email_Templete_Name = await welcomeEmailBody(data);
    } else if (
      Email_templete == 'forgetEmailBody' ||
      Email_templete == 'ForgetPass_Email_Body'
    ) {
      Email_Templete_Name = await forgetEmailBody(data);
    } else if (Email_templete == 'Report_Email_Body') {
      Email_Templete_Name = await Report_Email_Body(data);
    } else if (Email_templete == 'Post_Approve') {
      Email_Templete_Name = await Post_Approve(data);
    }

    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: 'it@LocalDonation.org',
            Name: process.env.Email_Name,
          },
          To: emailToSend,
          Subject: subject,
          HTMLPart: Email_Templete_Name,
          CustomID: 'AppGettingStartedTest',
        },
      ],
    });
    return await request;
  } catch (error) {
    console.error('Unable to send email:', error.message);
    return false;
  }
}

module.exports = {
  sendEmail,
};
