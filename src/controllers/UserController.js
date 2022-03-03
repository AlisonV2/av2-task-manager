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
      res.status(err.statusCode).json({ message: err.message });
    }
  }

  static async updateUser(req, res) {
    try {
      const user = await UserService.updateUser(req.user, req.body);
      res.status(200).json({
        message: 'User updated successfully',
        data: {
          ...user,
        },
      });
    } catch (err) {
      res.status(err.statusCode).json({ message: err.message });
    }
  }

  static async getUser(req, res) {
    try {
      const user = await UserService.getUser(req.user);
      res.status(200).json({
        message: 'User retrieved successfully',
        data: {
          ...user,
        },
      });
    } catch (err) {
      res.status(err.statusCode).json({ message: err.message });
    }
  }

  static async deleteUser(req, res) {
    try {
      await UserService.deleteUser(req.user);
      res.status(200).json({
        message: 'User deleted successfully',
      });
    } catch (err) {
      res.status(err.statusCode).json({ message: err.message });
    }
  }
}

export default UserController;
