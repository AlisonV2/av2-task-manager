
import express from 'express';
import Server from '../../src/config/Server';
import { usersRouter } from '../../src/routes/users';
import { tasksRouter } from '../../src/routes/tasks';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', usersRouter);
app.use('/api/tasks', tasksRouter);
app.use(Server.handleErrors);

export default app;