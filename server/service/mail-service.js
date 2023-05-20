/// сервис для работы с почтой
const nodemailer = require('nodemailer');
require('dotenv').config();

let smtpConfig =
{
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_MAIL_USER,
        pass: process.env.SMTP_MAIL_PASSWORD
    },
    logger: true,
    debug: true,
};

class MailService {
    constructor( config ) {
        // с помощью него отправляем сообщения
        this.transporter = nodemailer.createTransport( config );
    }

    /// @param email of user to send a message
    /// @param message presented as html
    async sendMail( to, subject, htmlMessage ) {
        await this.transporter.sendMail(
            {
                from : 'bookmarkex0@gmail.com',
                to,
                subject: subject,
                text: '',
                html: htmlMessage
            }
        );
    }
}

module.exports = new MailService( smtpConfig );
