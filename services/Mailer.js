const nodemailer = require('nodemailer');
const { htmlToText } = require('html-to-text');

const keys = require('../config/keys');

// Provide additional customization to the original Mail class
class Mailer {
  verifiedSenderEmail = 'ugulzar4512@gmail.com';

  constructor({ subject, recipients }, contentWithoutEmail) {
    this.to = this.formatRecipients(recipients);
    this.from = this.verifiedSenderEmail;
    this.subject = subject;
    this.contentWithoutEmail = contentWithoutEmail;
  }

  formatRecipients(recipients) {
    // Recipients in the array of objects, that has email property and some other properties, pull out the email property
    return recipients.map(recipient => recipient.email);
  }

  _newTransport() {
    return nodemailer.createTransport({
      // Using sendInBlue (that is also predefined)
      service: 'SendinBlue',
      auth: {
        user: keys.sendInBlueUser,
        pass: keys.sendInBluePass,
      },
    });
  }

  async send() {
    const that = {};
    that.from = this.from;
    that.to = this.to;
    that.subject = this.subject;
    that.contentWithoutEmail = this.contentWithoutEmail;
    that._newTransport = this._newTransport;

    this.to.map(async function (currentEmail) {
      const contentWithEmail = that.contentWithoutEmail(currentEmail);
      that.text = htmlToText(contentWithEmail);

      const mailOptions = {
        from: that.from,
        to: currentEmail,
        subject: that.subject,
        html: contentWithEmail,
        text: that.text,
      };

      // 3) Create a transport and send email
      const transporter = that._newTransport();
      await transporter.sendMail(mailOptions);
    });
  }
}

module.exports = Mailer;
