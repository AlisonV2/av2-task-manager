import SessionService from '../services/SessionService';
import LinksGenerator from '../helpers/LinksGenerator';

class SessionController {
  static async login(req, res) {
    try {
      const user = await SessionService.login(req.body);
      const links = LinksGenerator.generateLinks('login')
      res.status(200).json({...user, links});
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
