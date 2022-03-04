import TokenService from '../services/TokenService';
import LinksGenerator from '../helpers/LinksGenerator';

class TokenController {
  static async refreshToken(req, res) {
    try {
      const accessToken = await TokenService.refreshToken(req.body.refresh);
      const links = LinksGenerator.generateLinks('refreshToken');
      res.status(200).json({
        access: accessToken,
        links
      });
    } catch (err) {
      res.status(err.statusCode).json(err.message);
    }
  }

  static async verifyEmail(req, res) {
    try {
      await TokenService.verifyEmail(req.params.token);
      const links = LinksGenerator.generateLinks('verifyEmail');
      res.status(200).json(links);
    } catch (err) {
      res.status(err.statusCode).json(err.message);
    }
  }
}

export default TokenController;
