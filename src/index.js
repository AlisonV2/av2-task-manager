import express from 'express';
import Server from './config/Server';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

Server.start(app);