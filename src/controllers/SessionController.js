import SessionService from '../services/SessionService';

class SessionController {
  static async login(req, res) {
    try {
      const user = await SessionService.login(req.body);
      res.status(200).json({
        message: 'User logged in successfully',
        data: {
          ...user,
        },
      });
    } catch (err) {
      res.status(err.statusCode).json({ message: err.message });
    }
  }

  static async logout(req, res) {
    try {
      await SessionService.logout(req.user);
      res.status(200).json({
        message: 'User logged out successfully',
      });
    } catch (err) {
      res.status(err.statusCode).json({ message: err.message });
    }
  }
}

export default SessionController;
