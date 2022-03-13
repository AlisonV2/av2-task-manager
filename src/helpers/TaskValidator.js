import {
  InvalidDataError,
  NotFoundError,
  ForbiddenError,
} from '../helpers/ErrorGenerator';

export default class TaskValidator {
  static validateTaskFields(task) {
    if (!task.title || !task.description) {
      throw new InvalidDataError('Missing required fields');
    }
  }

  static validateUpdateFields(task) {
    const updates = Object.keys(task);
    const allowedUpdates = ['title', 'description', 'status', 'time'];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      throw new InvalidDataError('Invalid updates');
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

  static isEmptyData(tasks) {
    if (tasks.length === 0) {
      throw new NotFoundError('No tasks found');
    }
  }
}
