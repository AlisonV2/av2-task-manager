import express from 'express';
import Server from './config/Server';
import Database from './config/Database';
import { usersRouter } from './routes/users';
import { docsRouter } from './routes/docs';
import { tasksRouter } from './routes/tasks';
import { tokensRouter } from './routes/tokens';
import { sessionsRouter } from './routes/sessions';

const app = express();

Server.createLogs(app);

app
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(Server.setHeaders)
  .use('/api/docs', docsRouter)
  .use('/api/users', usersRouter)
  .use('/api/tasks', tasksRouter)
  .use('/api/tokens', tokensRouter)
  .use('/api/sessions', sessionsRouter)
  .use(Server.handleErrors)

Database.start();

export default app;
