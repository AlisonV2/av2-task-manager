import UserService from '../services/UserService';

class UserController {
  static async register(req, res) {
    try {
      await UserService.register(req.body);
      res.status(201).json({
        message:
          'An email has been sent to your account. Please verify your email to complete registration.',
      });
    } catch (err) {
      res
        .status(err.statusCode)
        .json({ message: err.message });
    }
  }

  static async login(req, res) {
    try {
      const user = await UserService.login(req.body);
      res.status(200).json({
        message: 'User logged in successfully',
        data: {
          ...user,
        },
      });
    } catch (err) {
      res
        .status(err.statusCode)
        .json({ message: err.message });
    }
  }

  static async logout(req, res) {
    try {
      await UserService.logout(req.user);
      res.status(200).json({
        message: 'User logged out successfully',
      });
    } catch (err) {
      res
        .status(err.statusCode)
        .json({ message: err.message });
    }
  }
}

export default UserController;
