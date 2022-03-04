import TokenService from '../services/TokenService';

class TokenController {
  static async refreshToken(req, res) {
    try {
      const accessToken = await TokenService.refreshToken(req.body.refresh);
      res.status(200).json({
        access: accessToken
      });
    } catch (err) {
      res.status(err.statusCode).json(err.message);
    }
  }

  static async verifyEmail(req, res) {
    try {
      await TokenService.verifyEmail(req.params.token);
      res.status(200).send();
    } catch (err) {
      res.status(err.statusCode).json(err.message);
    }
  }
}

export default TokenController;
