import express from 'express';
import UserController from '../controllers/UserController';
import authenticate from '../middleware/authenticate';

const router = express.Router();

router
    .post('/', UserController.login)
    .get('/', authenticate, UserController.logout)

export { router as sessionsRouter };

// /authentication : login (post), logout (get)
// /users : register, delete, update, verify