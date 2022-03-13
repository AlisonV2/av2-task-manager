import SecurityService from '../services/SecurityService';
import UserRepository from '../repositories/UserRepository';
import validator from 'validator';
import {
  InvalidDataError,
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  UnauthorizedError
} from '../helpers/ErrorGenerator';

export default class DataValidator {
  static isUserAuthenticated(user) {
    if (!user) {
      throw new UnauthorizedError('Not authenticated');
    }
  }

  static isUserLoggedIn(token) {
    if (!token) {
      throw new UnauthorizedError('Not authenticated');
    }
  }
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

  static validateUpdateFields(data, type) {
    const updates = Object.keys(data);
    const allowedUpdates =
      type === 'user'
        ? ['name', 'password', 'old_password']
        : ['title', 'description', 'status', 'time'];
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

  static isEmptyData(data, type) {
    if (data.length === 0) {
      throw new NotFoundError(`No ${type} found`);
    }
  }
  static validateTaskFields(task) {
    if (!task.title || !task.description) {
      throw new InvalidDataError('Missing required fields');
    }
  }

  static validateCompleteTask(task) {
    if (task.status === 'completed' && !task.time) {
      throw new InvalidDataError('Logging time is required to complete a task');
    }
  }

  static validateFilters(user, filters) {
    const allowedFilters =
      user.role === 'admin'
        ? ['admin', 'user', 'status', 'sort', 'limit', 'page']
        : ['status', 'sort', 'limit', 'page'];

    const filtersKeys = Object.keys(filters);
    const isAllowed = filtersKeys.every((filter) =>
      allowedFilters.includes(filter)
    );

    if (!isAllowed) {
      throw new ForbiddenError('Forbidden filters');
    }
  }
}
