import nodemailer from 'nodemailer';
import { config } from '../config/config.js';


let etherealTransport = null;

export async function enviarMail({ to, subject, html }) {
  if (process.env.MAIL_PROVIDER === 'ethereal') {
    // Inicializamos una sola vez el transport de Ethereal
    if (!etherealTransport) {
      const account = await nodemailer.createTestAccount();
      etherealTransport = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: { user: account.user, pass: account.pass },
      });
      console.log('✉️ Ethereal listo -> user:', account.user, 'pass:', account.pass);
    }

    const info = await etherealTransport.sendMail({
      from: config.mail.from || 'Ecommerce <no-reply@test>',
      to,
      subject,
      html,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) console.log('🔗 Vista previa del mail:', previewUrl);
    return info;
  }

  // Modo SMTP real (Hotmail/Gmail/Mailtrap/etc.)
  const transporter = nodemailer.createTransport({
    host: config.mail.host,
    port: config.mail.port,
    secure: false,
    auth: { user: config.mail.user, pass: config.mail.pass },
  });

  return transporter.sendMail({
    from: config.mail.from,
    to,
    subject,
    html,
  });
}