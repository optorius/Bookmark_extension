const mailService = require("../service/mail-service");

class MailController {
    async sendMail(req, res, next) {
        try {
            const { subject, message } = req.body;
            await mailService.sendMail( req.user.email, subject, message );
            return res.json({ message: "Successfully send a message to the user" });
        } catch( error ) {
            next(error);
        }
    }
}

module.exports = new MailController();
