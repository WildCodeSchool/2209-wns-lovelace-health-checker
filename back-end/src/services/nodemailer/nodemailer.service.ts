import nodemailer = require("nodemailer");

const NODEMAILER_USER = process.env.NODEMAILER_USER;
const NODEMAILER_PASS = process.env.NODEMAILER_PASS;
const FRONT_END_URL = process.env.FRONT_END_URL;
const RESET_PASSWORD_ROUTE = process.env.RESET_PASSWORD_ROUTE;
const ACCOUNT_CONFIRMATION_ROUTE = process.env.ACCOUNT_CONFIRMATION_ROUTE;
const RESET_EMAIL_ROUTE = process.env.RESET_EMAIL_ROUTE;

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
          <a href=${FRONT_END_URL}${ACCOUNT_CONFIRMATION_ROUTE}/${confirmationToken}>Confirm your email address</a>
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
          <a href=${FRONT_END_URL}${ACCOUNT_CONFIRMATION_ROUTE}/${confirmationToken}>Confirm my email address</a>
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
          <a href=${FRONT_END_URL}${RESET_PASSWORD_ROUTE}/${resetPasswordToken}>Change my password</a>
          <p>See you soon !</p>
          </div>`,
    })
    .catch((err) => console.log(err));
};

export const sendResetEmail = (
  name: string,
  email: string,
  resetEmailToken: string
) => {
  transport
    .sendMail({
      from: `Health Check <${NODEMAILER_USER}>`,
      to: email,
      subject: "[Health Check] Reset your email",
      html: `<p>Hello ${name},</p>
          <p>An email reset request has been made with your email address.</p>
          <p>If you did not initiate this request, you can ignore this email.</p>
          <p>The link below allows you to reset your email.</p>
          <a href=${FRONT_END_URL}${RESET_EMAIL_ROUTE}/${resetEmailToken}>Change my email</a>
          <p>See you soon !</p>
          </div>`,
    })
    .catch((err) => console.log(err));
};

export const sendAlertEmail = (
  name: string,
  email: string,
  requestSettingUrl: string,
  statusCode: number,
  requestResultDate: string,
  preventUntilDate: string
) => {
  transport
    .sendMail({
      from: `Health Check <${NODEMAILER_USER}>`,
      to: email,
      subject: `[Health Check] Error notification`,
      html: `<p>Hello ${name},</p>
          <p>The url ${requestSettingUrl} responded with the status code ${statusCode} on ${requestResultDate}.</p>
          <p>You got this email because you set the request to send an email alert for this status code.</p>
          <p>You can modify the settings of this request in order not to send email alerts.</p>
          <p>You will not receive another email alert for this request and for the status code ${statusCode} until ${preventUntilDate}.</p>`,
    })
    .catch((err) => console.log(err));
};
