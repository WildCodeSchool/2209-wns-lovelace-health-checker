import * as dotenv from 'dotenv';
import nodemailer = require('nodemailer');

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
      subject: "[Health Check] Confirmez votre inscription",
      html: `<p>Bonjour ${name},</p>
          <p>Merci pour votre inscription à Health Check. Merci de confirmer votre adresse email en cliquant sur le lien ci-dessous.</p>
          <a href=http://localhost:3000/confirmation/${confirmationToken}>Confirmer mon email</a>
          <p>A très vite !</p>
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
      subject: "[Health Check] Confirmez votre inscription",
      html: `<p>Bonjour ${name},</p>
          <p>Vous avez demandé à recevoir de nouveau la procédure de confirmation de compte. Merci de confirmer votre adresse email en cliquant sur le lien ci-dessous.</p>
          <a href=http://localhost:3000/confirmation/${confirmationToken}>Confirmer mon email</a>
          <p>A très vite !</p>
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
      subject: "[Health Check] Réinitialisation de votre mot de passe",
      html: `<p>Bonjour ${name},</p>
          <p>Une demande de réinitialisation de mot de passe a été effectuée avec votre adresse email.</p>
          <p>Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.</p>
          <p>Le lien ci-dessous vous permet de réinitialiser votre mot de passe, mais attention, <strong>il n'est valable que 30 minutes</strong>. Une fois ce délai passé, vous devrez effectuer une nouvelle demande de réinitialisation mot de passe.</p>
          <a href=http://localhost:3000/reinitialisation/${resetPasswordToken}>Modifier mon mot de passe</a>
          <p>A très vite !</p>
          </div>`,
    })
    .catch((err) => console.log(err));
};
