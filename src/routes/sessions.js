import express from 'express';
import SessionController from '../controllers/SessionController';
import authenticate from '../middleware/authenticate';

const router = express.Router();

router
    .post('/', SessionController.login)
    .get('/', authenticate, SessionController.logout)

export { router as sessionsRouter };

// delete to logout?

