import TokenService from '../services/TokenService';

class TokenController {
  static async refreshToken(req, res) {
    try {
      const accessToken = await TokenService.refreshToken(req.body.refresh);
      res.status(200).json({
        message: 'Token refreshed successfully',
        data: {
          access: accessToken,
        },
      });
    } catch (err) {
      res.status(err.statusCode).json({ message: err.message });
    }
  }

  static async verifyEmail(req, res) {
    try {
      await TokenService.verifyEmail(req.params.token);
      res.status(200).json({
        message: 'Email verified successfully',
      });
    } catch (err) {
      res.status(err.statusCode).json({ message: err.message });
    }
  }
}

export default TokenController;
