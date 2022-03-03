import express from 'express';
import UserController from '../controllers/UserController';
import authenticate from '../middleware/authenticate';

const router = express.Router();

router
    .post('/', UserController.register)
    .put('/', authenticate, UserController.updateUser)
    .get('/', authenticate, UserController.getUser)
    .delete('/', authenticate, UserController.deleteUser)

export { router as usersRouter };

// Add reset password 