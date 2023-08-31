const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');
const pug = require('pug');
const Brevo = require('nodemailer-brevo-transport');

module.exports = class Email {
  constructor(user, url) {
    this.firstName = user.name.split(' ')[0];
    this.to = user.email;
    this.url = url;
    this.from = `Natours <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production')
      return nodemailer.createTransport(
        new Brevo({ apiKey: process.env.BREVO_APIKEY }),
      );

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    const html = pug.renderFile(`__dirname/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.htmlToText(html),
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to Natours family!');
  }

  async sendResetPassword() {
    await this.send('resetPassword', 'Your password reset token');
  }
};
