/// @brief для навигации по приложениям

const Router = require('express').Router;
const userController = require('../controllers/user-controller');
const authMiddleware = require('../middlewares/auth-middleware');
const bookmarksController = require('../controllers/bookmarks-controller');
const secureController = require('../controllers/secure-controller');
const settingsController = require('../controllers/settings-controller');
const mailController = require( '../controllers/mail-controller' );

const router = new Router();

// для валидации тело запроса
const {body} = require('express-validator');
router.post('/registration',
    body('email').isEmail(),
    userController.registration
);
router.post('/login', userController.login);
router.post('/reset-password', userController.resetPassword);
router.get('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.delete('/users/:id', authMiddleware, userController.delete);
router.put('/settings', authMiddleware, settingsController.editSettings);
router.get('/settings', authMiddleware, settingsController.getSettings);
router.get('/users/:id', authMiddleware, userController.getUsers);
router.post('/bookmarks', authMiddleware, bookmarksController.pushBookmark);
router.get('/bookmarks', authMiddleware, bookmarksController.getBookmarks);
router.put('/bookmarks', authMiddleware, bookmarksController.editBookmark);
router.delete('/bookmarks/:id', authMiddleware, bookmarksController.delBookmark);
router.post("/message", authMiddleware, mailController.sendMail);
router.get('/secure/bookmarks', authMiddleware, secureController.getBadBookmarks);

module.exports = router;
