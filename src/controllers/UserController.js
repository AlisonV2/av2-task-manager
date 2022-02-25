import UserService from '../services/UserService';

class UserController {
  static async createUser(req, res) {
    // validate data + create only if admin
    try {
      await UserService.createUser(req.body);
      res.status(201).json({ 
        message: 'User created successfully',
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async login(req, res) {
    try {
      const user = await UserService.login(req.body);
      res.status(200).json({
        message: 'User logged in successfully',
        data: {
          ...user
        },
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async logout(req, res) {
    try {
      await UserService.logout(req.user);
      res.status(200).json({
        message: 'User logged out successfully'
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async refreshToken(req, res) {
    try {
      const accessToken = await UserService.refreshToken(req.body.refresh);
      res.status(200).json({
        message: 'Token refreshed successfully',
        data: {
          access: accessToken,
        },
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }
}

export default UserController;
