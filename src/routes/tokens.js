import express from 'express';
import TokenController from '../controllers/TokenController';

const router = express.Router();

router
  .post('/', TokenController.refreshToken)
  .get('/:token', TokenController.verifyEmail);

export { router as tokensRouter };
