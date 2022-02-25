import express from 'express';
import { usersRouter } from '../../src/routes/users';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', usersRouter);

Database.start('test');

