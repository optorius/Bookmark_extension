
/// логика контроллеров вынесена в service
/// сервис для работы с пользователем

const UserModel = require('../models/user-model'); // импортируем модель пользователя
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService  = require('./mail-service');
const tokenService = require('./token-service');
const TokenModel = require('../models/token-model');
const UserDto = require('../dto/user-dto');
const ApiError = require('../exceptions/api-error');
const { refresh } = require('../controllers/user-controller');
const BookmarksModel = require('../models/bookmarks-model');

async function generateToken( User ) {
    const userDto = new UserDto( User );

    // generate на входе ожидает обычный объект, instace user DTO, просто оборачиваем в обычный объект
    // генерация токенов
    const tokens = tokenService.generate( {...userDto} );

    // сохранение токенов в базу данных
    await tokenService.save(userDto.id, tokens.refreshToken);

    console.log("generated tokens");
    console.log("access:" + tokens.accessToken );
    console.log("refresh:" + tokens.refreshToken );

    return {
        ...tokens,
        user: userDto
    };
}

class UserService {
    async registration( email, password ) {
        const user = await UserModel.findOne({ email });

        if (user) {
            throw ApiError.badRequest("User with " + email + " already is exist in Database");
        }

        const salt = 5;
        const hashedPassword = await bcrypt.hash(password, salt);

        const activationLink = uuid.v4();

        const newUser = await UserModel.create({ email, password : hashedPassword, activationLink });
        await BookmarksModel.create( { user: newUser.id }); 

        // Отправляем письмо на активацию
        const link = process.env.API_URL + '/activate/' + activationLink;
        await mailService.sendMail(
            email,
            `Bookmark Extension account activation`,
            `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
            <h2 style="color: #007bff;">Welcome to Bookmark Extension!</h2>
            <p style="font-size: 16px; line-height: 1.5;">
                We're excited to have you on board. To get started, you need to activate your account. 
                It's easy — just click the button below.
            </p>
            <a href="${link}" target="_blank" rel="noopener noreferrer" 
               style="background-color: #007bff; color: #fff; text-decoration: none; padding: 15px 20px; 
                      border-radius: 5px; display: inline-block; margin-top: 20px;">
                Activate Account
            </a>
            <p style="font-size: 16px; line-height: 1.5; color: #777; margin-top: 30px;">
                If you have any questions, feel free to reply to this email. We're here to help!
            </p>
            <p style="font-size: 16px; line-height: 1.5;">
                Best regards,<br>
                The Bookmark Extension Team
            </p>
            </div>
            `
        )
        return generateToken( newUser );
    }

    async activate( activationLink ) {
        const user = await UserModel.findOne({activationLink});
        if (!user) {
            throw ApiError.badRequest("Activation link is not correct");
        }
        user.isActivated = true;
        await user.save();
    }

    async login( email, password ) {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw ApiError.badRequest("User with " + email + " does not exist in Database");
        }

        const isPasswordEqual = await bcrypt.compare(password, user.password);
        if ( !isPasswordEqual ) {
            throw ApiError.badRequest( 'Password incorrect' );
        }
        return generateToken( user );
    }

    async logout( refreshToken ) {
        const token = await tokenService.remove(refreshToken);
        /// можно вернуть 200 code !-!
        return token;
    }

    async delete( id ) {
        const user = await UserModel.findOne( { _id : id });
        console.log("trying to delete");
        await user.deleteOne();
        console.log("deleteMany");

        await TokenModel.deleteMany( { user: user._id } );

        await BookmarksModel.deleteMany( { user: user._id} );

        console.log("success delete");
    }

    async refresh( refreshToken ) {
        const userData = tokenService.validateRefresh( refreshToken );
        if (!userData) {
            console.log("Cannot validate your refresh token");
        }

        const tokenInDB = await tokenService.find( refreshToken );
        if (!tokenInDB) {
            console.log("Cannot find refresh token in DataBase");
        }

        const user = await UserModel.findById(userData.id);
        return generateToken( user );
    }

    async getUsers(id) {
        const user = await UserModel.findById( id );
        return user;
    }

}

module.exports = new UserService();
