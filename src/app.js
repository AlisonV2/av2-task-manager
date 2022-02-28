import express from 'express';
import Server from './config/Server';
import Database from './config/Database';
import { usersRouter } from './routes/users';
import { docsRouter } from './routes/docs';
import { tasksRouter } from './routes/tasks';
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

if (process.env.NODE_ENV !== 'test') {
  Database.start('dev');
}

export default app;
