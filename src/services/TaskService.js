import TaskRepository from '../repositories/TaskRepository';

class TaskService {
  static async createTask(user, task) {
    try {
      const newTask = {
        title: task.title,
        description: task.description,
        status: task.status,
        user: user.id,
      };

      const createdTask = await TaskRepository.createTask(newTask);
      return TaskRepository.formatTask(createdTask);
    } catch (err) {
      const error = new Error('Error creating task');
      error.statusCode = 400;
      throw error;
    }
  }

  static async updateTask(user, id, task) {
    const updates = Object.keys(task);
    const allowedUpdates = ['title', 'description', 'status', 'time'];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      const error = new Error('Invalid updates');
      error.statusCode = 400;
      throw error;
    }

    try {
      const query = { _id: id, user: user.id };

      if (task.status === 'completed' && !task.time) {
        const error = new Error('Logging time is required to complete a task');
        error.statusCode = 400;
        throw error;
      }

      const updatedTask = await TaskRepository.updateTask(query, task);

      return TaskRepository.formatTask(updatedTask);
    } catch (err) {
      const error = new Error('Error updating task');
      error.statusCode = 400;
      throw error;
    }
  }

  static async getTaskById(user, id) {
    try {
      const query = { _id: id, user: user.id };
      const task = await TaskRepository.getTask(query);

      return TaskRepository.formatTask(task);
    } catch (err) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }
  }

  static async deleteTask(user, id) {
    try {
      const query = { _id: id, user: user.id };
      await TaskRepository.deleteTask(query);

      return 'Task deleted successfully';
    } catch (err) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }
  }

  static isOperationAllowed(filters, allowedFilters) {
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
  static async getTasks(user, filters) {
    try {
      const allowedFilters =
        user.role === 'admin'
          ? ['admin', 'user', 'status', 'sort', 'limit', 'page']
          : ['status', 'sort', 'limit', 'page'];

      this.isOperationAllowed(filters, allowedFilters);

      let match = {};

      if (user.role === 'user') {
        match = { user: user.id };
      }

      if (user.role === 'admin' && !filters.admin) {
        match = { user: user.id };
      }

      if (user.role === 'admin' && filters.admin && filters.user) {
        match = { user: filters.user };
      }

      if (user.role === 'admin' && filters.admin && !filters.user) {
        match = {};
      }

      let sort = {};
      let limit = 0;
      let skip = 0;

      if (filters.status) {
        match.status = filters.status;
      }

      if (filters.sort) {
        const parts = filters.sort.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
      }

      if (filters.limit) {
        limit = parseInt(filters.limit);
      }

      if (filters.page) {
        skip = parseInt(filters.page - 1) * limit;
      }

      const tasks = await TaskRepository.getTasks(match, sort, skip, limit);

      if (tasks.length === 0) {
        const error = new Error('No tasks found');
        error.statusCode = 404;
        throw error;
      }

      let formattedTasks = [];
      for (let i in tasks) {
        formattedTasks.push(TaskRepository.formatTask(tasks[i]));
      }
      return formattedTasks;
    } catch (err) {
      const error = new Error(err.message);
      error.statusCode = err.statusCode;
      throw error;
    }
  }
}

export default TaskService;
