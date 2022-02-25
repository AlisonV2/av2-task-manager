import express from 'express';
import UserController from '../controllers/UserController';

const router = express.Router();

router.post('/', UserController.createUser);

export { router as usersRouter };
