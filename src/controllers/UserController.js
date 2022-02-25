import UserService from '../services/UserService';

class UserController {
  static async createUser(req, res) {
    try {
      await UserService.createUser(req.body);
      res.status(201).json({ 
        message: 'User created successfully',
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }
}

export default UserController;
