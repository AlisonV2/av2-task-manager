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
}

export default UserController;
