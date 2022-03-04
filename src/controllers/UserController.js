import UserService from '../services/UserService';

class UserController {
  static async register(req, res) {
    try {
      await UserService.register(req.body);
      res.status(201).send();
    } catch (err) {
      res.status(err.statusCode).json(err.message);
    }
  }

  static async updateUser(req, res) {
    try {
      const user = await UserService.updateUser(req.user, req.body);
      res.status(200).json(user);
    } catch (err) {
      res.status(err.statusCode).json(err.message);
    }
  }

  static async getUser(req, res) {
    try {
      const user = await UserService.getUser(req.user);
      res.status(200).json(user);
    } catch (err) {
      res.status(err.statusCode).json(err.message);
    }
  }

  static async deleteUser(req, res) {
    try {
      await UserService.deleteUser(req.user);
      res.status(204).json();
    } catch (err) {
      res.status(err.statusCode).json(err.message);
    }
  }
}

export default UserController;
