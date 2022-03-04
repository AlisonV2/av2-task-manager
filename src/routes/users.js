import express from 'express';
import UserController from '../controllers/UserController';
import authenticate from '../middleware/authenticate';

const router = express.Router();

router
    .post('/', UserController.register)
    .put('/current', authenticate, UserController.updateUser)
    .get('/current', authenticate, UserController.getUser)
    .delete('/current', authenticate, UserController.deleteUser)

export { router as usersRouter };

// Add reset password 