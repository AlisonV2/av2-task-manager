import express from 'express';
import Server from './config/Server';
import Database from './config/Database';
import { usersRouter } from './routes/users';
import { docsRouter } from './routes/docs';
import { tasksRouter } from './routes/tasks';
import { tokensRouter } from './routes/tokens';
import { sessionsRouter } from './routes/sessions';

import dotenv from 'dotenv';
dotenv.config();

const app = express();

Server.createLogs(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(Server.setHeaders);
app.use('/api/docs', docsRouter);
app.use('/api/users', usersRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/tokens', tokensRouter);
app.use('/api/sessions', sessionsRouter);

Database.start();

export default app;
