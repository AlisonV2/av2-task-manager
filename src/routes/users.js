import express from 'express';
import UserController from '../controllers/UserController';
import authenticate from '../middleware/authenticate';

const router = express.Router();

router
    .post('/', UserController.register)
export { router as usersRouter };

// /authentication : login (post), logout (get)
// /users : register, delete, update, verify