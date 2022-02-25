import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';

const router = express.Router();

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export { router as docsRouter };
