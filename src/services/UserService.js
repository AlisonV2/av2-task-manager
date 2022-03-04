import SecurityService from './SecurityService';
import EmailService from './EmailService';
import UserRepository from '../repositories/UserRepository';
import TaskRepository from '../repositories/TaskRepository';

class UserService {
  static async createUser(user) {
    const existingUser = await UserRepository.getUser({ email: user.email });

    if (existingUser) {
      const error = new Error('User already exists');
      error.statusCode = 400;
      throw error;
    }

    if (!user.name || !user.email || !user.password) {
      const error = new Error('Missing required fields');
      error.statusCode = 400;
      throw error;
    }

    const hashed = await SecurityService.hashPassword(user.password);
    const newUser = await UserRepository.createUser({
      name: user.name,
      email: user.email,
      password: hashed,
    });

    return UserRepository.formatUser(newUser);
  }

  static async register(user) {
    try {
      const newUser = await this.createUser(user);
      const createdToken = await SecurityService.createToken(newUser);
      return await EmailService.sendMail(createdToken.token, newUser.email);
    } catch (err) {
      const error = new Error(err.message);
      error.statusCode = 400;
      throw error;
    }
  }
  
  static async updateUser(user, data) {
    const updates = Object.keys(data)
    const allowedUpdates = ['name'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
      const error = new Error('Invalid updates')
      error.statusCode = 400
      throw error;
    }

    try {
      const updatedUser = await UserRepository.updateUser({ ...user, ...data });
      return UserRepository.formatUser(updatedUser);
    } catch (err) {
      const error = new Error('Error updating user');
      error.statusCode = 400;
    }
  }

  static async getUser(user) {
    try {
      const foundUser = await UserRepository.getUser({ _id: user.id });

      return UserRepository.formatUser(foundUser);
    } catch (err) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
  }

  static async deleteUser(user) {
    try {
      await UserRepository.deleteUser(user.id);
      await TaskRepository.deleteUserTasks(user.id);
      return 'User deleted successfully';
    } catch (err) {
      const error = new Error('Error deleting user');
      error.statusCode = 400;
      throw error;
    }
  }
}

export default UserService;
