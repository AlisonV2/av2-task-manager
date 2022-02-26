import express from 'express';
import UserController from '../controllers/UserController';
import auth from '../middleware/auth';

const router = express.Router();

router
    .post('/', UserController.createUser)
    .post('/login', UserController.login)
    .post('/logout', auth, UserController.logout)
    .post('/refresh', UserController.refreshToken);

export { router as usersRouter };
