import SecurityService from './SecurityService';
import EmailService from './EmailService';
import UserRepository from '../repositories/UserRepository';
import TaskRepository from '../repositories/TaskRepository';
import DataValidator from '../helpers/DataValidator';
import { NotFoundError, BadRequestError } from '../helpers/ErrorGenerator';

export default class UserService {
  static async createUser(user) {
    await DataValidator.isExistingUser(user.email);
    DataValidator.validateUserFields(user);

    const hashed = await SecurityService.hashPassword(user.password);
    const newUser = await UserRepository.createUser({
      name: user.name,
      email: user.email,
      password: hashed,
    });

    return UserRepository.formatUser(newUser);
  }

  static async register(user) {
    DataValidator.validateEmail(user.email);
    const newUser = await this.createUser(user);
    const createdToken = await SecurityService.createToken(newUser);
    return EmailService.sendMail(createdToken.token, newUser.email);
  }

  static async updatePassword(id, password, old_password) {
    const foundUser = await UserRepository.getUser({ _id: id });

    await DataValidator.validatePasswordUpdate(
      foundUser.password,
      old_password
    );

    return SecurityService.hashPassword(password);
  }

  static async updateUser(user, data) {
    DataValidator.validateUpdateFields(data, 'user');

    if (data.password) {
      DataValidator.validatePasswordFields(data);
      data.password = await this.updatePassword(
        user.id,
        data.password,
        data.old_password
      );
    }
    const updatedUser = await UserRepository.updateUser({ ...user, ...data });
    return UserRepository.formatUser(updatedUser);
  }

  static async getUser(user) {
    try {
      const foundUser = await UserRepository.getUser({ _id: user.id });
      return UserRepository.formatUser(foundUser);
    } catch (err) {
      throw new NotFoundError('User not found');
    }
  }

  static async deleteUser(user) {
    try {
      await UserRepository.deleteUser(user.id);
      await TaskRepository.deleteUserTasks(user.id);
      return 'User deleted successfully';
    } catch (err) {
      throw new BadRequestError('Error deleting user');
    }
  }

  static async getAllUsers(user) {
    DataValidator.validateAdminRole(user.role);

    const users = await UserRepository.getAllUsers();

    DataValidator.isEmptyData(users, 'users');

    return users.map((u) => UserRepository.formatUser(u));
  }
}
