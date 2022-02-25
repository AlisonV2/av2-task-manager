import fs from 'fs';
import morgan from 'morgan';

class Server {
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
    const status = err.statusCode || 500;
    const message = err.message;
    const data = err.data;
    res.status(status).json({ message, data });
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

export default Server;
