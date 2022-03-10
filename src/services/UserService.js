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
      error.statusCode = 409;
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

  static async updatePassword(id, password, old_password) {
    const foundUser = await UserRepository.getUser({ _id: id });
    const isValidPassword = await SecurityService.comparePassword(
      old_password,
      foundUser.password
    );

    if (!isValidPassword) {
      const error = new Error('Invalid password');
      error.statusCode = 409;
      throw error;
    }

    return SecurityService.hashPassword(password);
  }

  static async updateUser(user, data) {
    const updates = Object.keys(data);
    const allowedUpdates = ['name', 'password', 'old_password'];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      const error = new Error('Invalid updates');
      error.statusCode = 409;
      throw error;
    }

    if (data.password && !data.old_password) {
      const error = new Error('Missing old password');
      error.statusCode = 409;
      throw error;
    }

    if (data.password) {
      data.password = await this.updatePassword(user.id, data.password, data.old_password);
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

  static async getAllUsers(user) {
    try {
      if (user.role !== 'admin') {
        const error = new Error('Unauthorized');
        error.statusCode = 403;
        throw error;
      }

      const users = await UserRepository.getAllUsers();

      if (users.length === 0) {
        const error = new Error('No users found');
        error.statusCode = 404;
        throw error;
      }

      return users.map((u) => UserRepository.formatUser(u));
    } catch (err) {
      const error = new Error(err.message);
      error.statusCode = err.statusCode;
      throw error;
    }
  }
}

export default UserService;
