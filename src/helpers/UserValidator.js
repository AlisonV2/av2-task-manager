import SecurityService from '../services/SecurityService';
import UserRepository from '../repositories/UserRepository';
import validator from 'validator';
import {
  InvalidDataError,
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} from '../helpers/ErrorGenerator';

export default class DataValidator {
  static validateEmail(email) {
    if (!validator.isEmail(email)) {
      throw new InvalidDataError('Invalid email');
    }
  }

  static validateUserFields(user) {
    if (!user.name || !user.email || !user.password) {
      throw new InvalidDataError('Missing required fields');
    }
  }

  static async isExistingUser(email) {
    const existingUser = await UserRepository.getUser({ email: email });
    if (existingUser) {
      throw new BadRequestError('User already exists');
    }
  }

  static async validatePasswordUpdate(password, old_password) {
    const isValidPassword = await SecurityService.comparePassword(
      old_password,
      password
    );

    if (!isValidPassword) {
      throw new InvalidDataError('Invalid password');
    }
  }

  static validatePasswordFields(data) {
    if (data.password && !data.old_password) {
      throw new InvalidDataError('Missing old password');
    }
  }

  static validateUpdateFields(data) {
    const updates = Object.keys(data);
    const allowedUpdates = ['name', 'password', 'old_password'];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      throw new InvalidDataError('Invalid updates');
    }
  }

  static validateAdminRole(role) {
    if (role !== 'admin') {
      throw new ForbiddenError('Unauthorized');
    }
  }

  static isEmptyData(users) {
    if (users.length === 0) {
      throw new NotFoundError('No users found');
    }
  }
}
