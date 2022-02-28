import express from 'express';
import UserController from '../controllers/UserController';
import auth from '../middleware/auth';

const router = express.Router();

router
    .post('/', UserController.register)
    .post('/login', UserController.login)
    .get('/logout', auth, UserController.logout)
    .post('/refresh', UserController.refreshToken)
    .get('/verify/:token', UserController.verifyEmail);

export { router as usersRouter };
