const userService = require('../service/user-service');
const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/api-error');
const tokenService = require('../service/token-service');
const mailService = require('../service/mail-service');


/// Записываем в cookie рефреш токен
function refreshCookie( res, token )
{
    const maxAge = 30 * 24 * 60 * 60 * 1000;
    // внутри браузера, из js нельзя получать для этого httpOnly + для этого необходимо подключить cookieparser
    res.cookie('refreshToken', token, { maxAge: maxAge, httpOnly: true });
}

class UserController {

    /// функция next
    async registration(req, res, next) {
        try {

            // валидация тела
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
               return next( ApiError.badRequest("Validation error", errors.array()) );
            }

            /// вытаскивем из тело запроса емайл и пароль
            const { email, password } = req.body;

            /// userData - tokens, userDTO
            const userData = await userService.registration(email, password);
            refreshCookie( res, userData.refreshToken );
            return res.json( userData );
        } catch (error) {
            next(error); // попадаем в наш middleware
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const userData = await userService.login(email, password);
            refreshCookie( res, userData.refreshToken );
            return res.json( userData );
        } catch (error) {
            next(error); // попадаем в наш middleware
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            //  можно вернуть 200 code
            return res.json( token );
        } catch (error) {
            next(error); // попадаем в наш middleware
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            console.log("deleting with id:", id);
            await userService.delete(id);
            res.clearCookie('refreshToken');
            res.statusCode = 204;
            return res.json();
        } catch (error) {
            next(error); // попадаем в наш middleware
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            /// CLIENT URL:
            return res.redirect('https://github.com/optorius/Bookmark_extension');
        } catch (error) {
            next(error);
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            console.log("refresh token:" + refreshToken);
            const userData = await userService.refresh(refreshToken);
            refreshCookie( res, userData.refreshToken );
            return res.json( userData );
        } catch (error) {
            next(error);
        }
    }

    async getUsers(req, res, next) {
        try {
            const {id} = req.params;
            const user = await userService.getUsers(id);
            return res.json( user );
        } catch (error) {
            next(error);
        }
    }

    async sendCode( req, res, next ) {
        try {
            const { email } = req.body;
            const code = await userService.sendCode( email );
            await mailService.sendMail(email, "Bookmark Extension - Password Reset",
            `<div>
                <h2>Password Reset</h2>
                <p>Dear user,</p>
                <p>We have received a request to reset your password for the Bookmark extension. Please use the following code to proceed with the password reset:</p>
                <p><strong>Reset Code:</strong> ${code}</p>
                <p>If you did not request a password reset, please ignore this email.</p>
                <p>Best regards,</p>
                <p>The Bookmark Team</p>
            </div>`
            );
            return res.json({ message: "Password reset code has been sent to your email." });
        } catch (error) {
            next(error);
        }
    }

    async resetPassword( req, res, next ) {
        try {
            const { email, code, password } = req.body;
            const result = await userService.resetPassword( email, code, password );
            return res.json( { message: "Successfully changed your password!" } );
        } catch(error) {
            next(error);
        }
    }

}

module.exports = new UserController();
