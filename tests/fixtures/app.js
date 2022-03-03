
import express from 'express';
import Server from '../../src/config/Server';
import { usersRouter } from '../../src/routes/users';
import { tasksRouter } from '../../src/routes/tasks';
import { tokensRouter } from '../../src/routes/tokens';
import { sessionsRouter } from '../../src/routes/sessions';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(Server.setHeaders);
app.use('/api/users', usersRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/tokens', tokensRouter);
app.use('/api/sessions', sessionsRouter);

export default app;