import SessionService from '../services/SessionService';

class SessionController {
  static async login(req, res) {
    try {
      const user = await SessionService.login(req.body);
      res.status(200).json(user);
    } catch (err) {
      res.status(err.statusCode).json(err.message);
    }
  }

  static async logout(req, res) {
    try {
      await SessionService.logout(req.user);
      res.status(204).send();
    } catch (err) {
      res.status(err.statusCode).json(err.message);
    }
  }
}

export default SessionController;
