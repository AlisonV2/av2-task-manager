import SecurityService from './SecurityService';
import EmailService from './EmailService';
import UserRepository from '../repositories/UserRepository';
import TaskRepository from '../repositories/TaskRepository';
import UserValidator from '../helpers/UserValidator';

class UserService {
  static async createUser(user) {
    await UserValidator.isExistingUser(user.email);
    UserValidator.validateUserFields(user);

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
      UserValidator.validateEmail(user.email);
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

    await UserValidator.validatePasswordUpdate(
      foundUser.password,
      old_password
    );

    return SecurityService.hashPassword(password);
  }

  static async updateUser(user, data) {
    UserValidator.validateUpdateFields(data);
    UserValidator.validatePasswordFields(data);

    try {
      if (data.password) {
        data.password = await this.updatePassword(
          user.id,
          data.password,
          data.old_password
        );
      }
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
      UserValidator.validateAdminRole(user.role);

      const users = await UserRepository.getAllUsers();

      UserValidator.isEmptyData(users);

      return users.map((u) => UserRepository.formatUser(u));
    } catch (err) {
      const error = new Error(err.message);
      error.statusCode = err.statusCode;
      throw error;
    }
  }
}

export default UserService;
