import fs from 'fs';
import morgan from 'morgan';

export default class Server {
  static createLogs(app) {
    const accessLogStream = fs.createWriteStream('./logs/access.log', {
      flags: 'a',
    });
    app.use(morgan('combined', { stream: accessLogStream }));
  }

  static setHeaders(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization'
    );
    next();
  }

  static handleErrors(err, req, res, next) {
    if (err.statusCode) {
      res.status(err.statusCode).json(err.message);
    } else {
      res.status(500).json('Internal server error');
    }
  }

  static async start(app) {
    const port = process.env.port || 3000;
    try {
      await app.listen(port);
      console.log(`Server listening on port ${port}`);
    } catch (err) {
      console.error(err);
    }
  }
}