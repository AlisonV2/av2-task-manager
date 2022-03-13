export default class TaskValidator {
  static validateTaskFields(task) {
    if (!task.title || !task.description) {
      const error = new Error('Missing required fields');
      error.statusCode = 409;
      throw error;
    }
  }

  static validateUpdateFields(task) {
    const updates = Object.keys(task);
    const allowedUpdates = ['title', 'description', 'status', 'time'];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      const error = new Error('Invalid updates');
      error.statusCode = 409;
      throw error;
    }
  }

  static validateCompleteTask(task) {
    if (task.status === 'completed' && !task.time) {
      const error = new Error('Logging time is required to complete a task');
      error.statusCode = 409;
      throw error;
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
      const error = new Error('Forbidden filters');
      error.statusCode = 403;
      throw error;
    }
  }

  static isEmptyData(tasks) {
    if (tasks.length === 0) {
      const error = new Error('No tasks found');
      error.statusCode = 404;
      throw error;
    }
  }
}
