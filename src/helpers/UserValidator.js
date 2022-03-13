import SecurityService from '../services/SecurityService';
import UserRepository from '../repositories/UserRepository';
import validator from 'validator';

export default class DataValidator {
  static validateEmail(email) {
    if (!validator.isEmail(email)) {
      const error = new Error('Invalid email');
      error.statusCode = 409;
      throw error;
    }
  }

  static validateUserFields(user) {
    if (!user.name || !user.email || !user.password) {
      const error = new Error('Missing required fields');
      error.statusCode = 409;
      throw error;
    }
  }

  static async isExistingUser(email) {
    const existingUser = await UserRepository.getUser({ email: email });
    if (existingUser) {
      const error = new Error('User already exists');
      error.statusCode = 400;
      throw error;
    }
  }

  static async validatePasswordUpdate(password, old_password) {
    const isValidPassword = await SecurityService.comparePassword(
      old_password,
      password
    );

    if (!isValidPassword) {
      const error = new Error('Invalid password');
      error.statusCode = 409;
      throw error;
    }
  }

  static validatePasswordFields(data) {
    if (data.password && !data.old_password) {
      const error = new Error('Missing old password');
      error.statusCode = 409;
      throw error;
    }
  }

  static validateUpdateFields(data) {
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
  }

  static validateAdminRole(role) {
    if (role !== 'admin') {
      const error = new Error('Unauthorized');
      error.statusCode = 403;
      throw error;
    }
  }

  static isEmptyData(users) {
    if (users.length === 0) {
      const error = new Error('No users found');
      error.statusCode = 404;
      throw error;
    }
  }
}
