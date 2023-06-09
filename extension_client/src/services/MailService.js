import api_axios from "../http";

export default class MailService {

    /// @brief send message to user
    static async sendMail( subject, message )
    {
        return api_axios.post( "/message", 
        {
            subject : subject,
            message : message
        } );
    }
}