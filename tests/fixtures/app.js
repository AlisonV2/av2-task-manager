import express from 'express';
import Server from '../../src/config/Server';
import { usersRouter } from '../../src/routes/users';
import { tasksRouter } from '../../src/routes/tasks';
import { tokensRouter } from '../../src/routes/tokens';
import { sessionsRouter } from '../../src/routes/sessions';

const app = express();
app
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(Server.setHeaders)
  .use('/api/users', usersRouter)
  .use('/api/tasks', tasksRouter)
  .use('/api/tokens', tokensRouter)
  .use('/api/sessions', sessionsRouter);

export default app;
