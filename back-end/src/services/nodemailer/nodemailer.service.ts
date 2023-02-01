import nodemailer = require("nodemailer");

const NODEMAILER_USER = process.env.NODEMAILER_USER;
const NODEMAILER_PASS = process.env.NODEMAILER_PASS;
const FRONT_END_URL = process.env.FRONT_END_URL;

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: NODEMAILER_USER,
    pass: NODEMAILER_PASS,
  },
});

export const sendConfirmationEmail = (
  name: string,
  email: string,
  confirmationToken: string
) => {
  transport
    .sendMail({
      from: `Health Check <${NODEMAILER_USER}>`,
      to: email,
      subject: "[Health Check] Confirm your account",
      html: `<p>Hello ${name},</p>
          <p>Thanks for registering for Health Check. Please confirm your email address by clicking the link below.</p>
          <a href=${FRONT_END_URL}/account-confirmation/${confirmationToken}>Confirm your email address</a>
          <p>See you soon !</p>
          </div>`,
    })
    .catch((err) => console.log(err));
};

export const resendConfirmationEmail = (
  name: string,
  email: string,
  confirmationToken: string
) => {
  transport
    .sendMail({
      from: `Health Check <${NODEMAILER_USER}>`,
      to: email,
      subject: "[Health Check] Confirm your account",
      html: `<p>Hello ${name},</p>
          <p>You have requested to receive the account confirmation procedure again. Please confirm your email address by clicking the link below.</p>
          <a href=${FRONT_END_URL}/account-confirmation/${confirmationToken}>Confirm my email address</a>
          <p>See you soon !</p>
          </div>`,
    })
    .catch((err) => console.log(err));
};

export const sendResetPasswordEmail = (
  name: string,
  email: string,
  resetPasswordToken: string
) => {
  transport
    .sendMail({
      from: `Health Check <${NODEMAILER_USER}>`,
      to: email,
      subject: "[Health Check] Reset your password",
      html: `<p>Hello ${name},</p>
          <p>A password reset request has been made with your email address.</p>
          <p>If you did not initiate this request, you can ignore this email.</p>
          <p>The link below allows you to reset your password, but be careful, <strong>it is only valid for ${
            parseInt(process.env.RESET_PASSWORD_EXPIRATION_DELAY!!) / 60000
          } minute(s)</strong>. Once this period has passed, you will have to make a new password reset request.</p>
          <a href=${FRONT_END_URL}/reset-password/${resetPasswordToken}>Change my password</a>
          <p>See you soon !</p>
          </div>`,
    })
    .catch((err) => console.log(err));
};