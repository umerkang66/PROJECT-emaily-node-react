const sgMail = require('@sendgrid/mail');
const { htmlToText } = require('html-to-text');
const nodemailer = require('nodemailer');
const keys = require('../config/keys');

class MailerSendGrid {
  verifiedSenderEmail = 'umerkang77@gmail.com';

  constructor({ subject, recipients }, content) {
    this.sgMail = sgMail.setApiKey(keys.sendGridKey);

    this.msg = {
      to: this.formatRecipients(recipients),
      from: this.verifiedSenderEmail,
      subject: subject,
      text: htmlToText(content),
      html: content,
      trackingSettings: {
        clickTracking: {
          enable: true,
          enableText: true,
        },
      },
    };
  }

  formatRecipients(recipients) {
    // Recipients in the array of objects, that has email property and some other properties, pull out the email property
    return recipients.map(recipient => recipient.email);
  }

  async send() {
    const response = await this.sgMail.send(this.msg);
    return response;
  }
}

class MailerSendInBlue {
  verifiedSenderEmail = 'umerkang77@gmail.com';

  // Content should be provided as html template
  constructor({ subject, recipients }, content) {
    this.to = this.formatRecipients(recipients);
    this.from = this.verifiedSenderEmail;
    this.subject = subject;
    this.text = htmlToText(content);
    this.html = content;
  }

  formatRecipients(recipients) {
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
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: this.subject,
      html: this.html,
      text: this.text,
    };

    // 3) Create a transport and send email
    const transporter = this._newTransport();
    await transporter.sendMail(mailOptions);
  }
}
