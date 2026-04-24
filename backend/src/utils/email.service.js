const nodemailer = require("nodemailer");

/**
 * Service d'envoi d'emails Scolaris
 */
const sendEmail = async (to, subject, text, html) => {
  try {
    // Configuration du transporteur
    // Si vous n'avez pas encore de SMTP, il utilisera un mode "debug"
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: process.env.EMAIL_PORT || 587,
      secure: false, // true pour le port 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const info = await transporter.sendMail({
      from: `"Scolaris" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html
    });

    console.log("Email envoyé avec succès : %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Erreur d'envoi d'email :", error);
    // On ne bloque pas le processus mais on log l'erreur
    return false;
  }
};

module.exports = sendEmail;