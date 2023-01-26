import * as dotenv from "dotenv";
import nodemailer = require("nodemailer");

dotenv.config();

const user = process.env.NODEMAILER_USER;
const pass = process.env.NODEMAILER_PASS;

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: user,
    pass: pass,
  },
});

// TODO : Use dynamical url for client
export const sendConfirmationEmail = (
  name: string,
  email: string,
  confirmationToken: string
) => {
  transport
    .sendMail({
      from: `Health Check <${user}>`,
      to: email,
      subject: "[Health Check] Confirm your account",
      html: `<p>Hello ${name},</p>
          <p>Thank you for registering for Health Check. Please confirm your email address by clicking the link below.</p>
          <a href=http://localhost:3000/account-confirmation/${confirmationToken}>Confirm your email address</a>
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
      from: `Health Check <${user}>`,
      to: email,
      subject: "[Health Check] Confirm your account",
      html: `<p>Hello ${name},</p>
          <p>You have requested to receive the account confirmation procedure again. Please confirm your email address by clicking the link below.</p>
          <a href=http://localhost:3000/account-confirmation/${confirmationToken}>Confirm my email address</a>
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
      from: `Health Check <${user}>`,
      to: email,
      subject: "[Health Check] Reset your password",
      html: `<p>Hello ${name},</p>
          <p>A password reset request has been made with your email address.</p>
          <p>If you did not initiate this request, you can ignore this email.</p>
          <p>The link below allows you to reset your password, but be careful, <strong>it is only valid for ${
            parseInt(process.env.RESET_PASSWORD_EXPIRATION_DELAY!!) / 60000
          } minute(s)</strong>. Once this period has passed, you will have to make a new password reset request.</p>
          <a href=http://localhost:3000/reset-password/${resetPasswordToken}>Change my password</a>
          <p>See you soon !</p>
          </div>`,
    })
    .catch((err) => console.log(err));
};
