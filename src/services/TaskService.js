import TaskRepository from '../repositories/TaskRepository';
import CacheService from './CacheService';

const cache = new CacheService(3000);

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
      cache.set(`task-${createdTask._id}`, createdTask);
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
      error.statusCode = 409;
      throw error;
    }

    try {
      const query = { _id: id, user: user.id };

      if (task.status === 'completed' && !task.time) {
        const error = new Error('Logging time is required to complete a task');
        error.statusCode = 409;
        throw error;
      }

      const updatedTask = await TaskRepository.updateTask(query, task);
      cache.update(`task-${user.id}-${id}`, updatedTask);

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
      const cached = cache.get(`task-${user.id}-${id}`);

      if (cached) return TaskRepository.formatTask(cached);

      const task = await TaskRepository.getTask(query);
      cache.set(`task-${user.id}-${id}`, task);
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
      cache.del(`task-${user.id}-${id}`);

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

  static formatMatch(user, filters) {    
    switch (user.role) {
      case 'user':
        return { user: user.id };
      case 'admin':
        if (!filters.admin) return { user: user.id };
        if (filters.admin && filters.user) return { user: filters.user };
        if (filters.admin && !filters.user) return {};
    }
  }

  static formatKey(match, sort, skip, limit) {
    let key = 'tasks';
    const matchKeys = Object.keys(match);
    const sortKeys = Object.keys(sort);
    if (matchKeys.length > 0) {
      for (let i in matchKeys) {
        key += '-' + matchKeys[i] + '-' + match[matchKeys[i]];
      }
    }

    if (sortKeys.length > 0) key += `-sort-${sortKeys[0]}-${sort[sortKeys[0]]}`;
    if (skip > 0) key += `-skip-${skip}`;
    if (limit > 0) key += `-limit-${limit}`;
    return key;
  }

  static async getTasks(user, filters) {
    try {
      const allowedFilters =
        user.role === 'admin'
          ? ['admin', 'user', 'status', 'sort', 'limit', 'page']
          : ['status', 'sort', 'limit', 'page'];

      this.isOperationAllowed(filters, allowedFilters);

      const match = this.formatMatch(user, filters);

      let sort = {};
      let limit = 0;
      let skip = 0;

      if (filters.status) match.status = filters.status;
      if (filters.limit) limit = parseInt(filters.limit);
      if (filters.page) skip = parseInt(filters.page - 1) * limit;
      if (filters.sort) {
        const parts = filters.sort.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
      }

      const key = this.formatKey(match, sort, skip, limit)
      console.log(key)

      const tasks = await TaskRepository.getTasks(match, sort, skip, limit);
      // cache.set(key, tasks);
      return this.formatAllTasks(tasks);
    } catch (err) {
      const error = new Error(err.message);
      error.statusCode = err.statusCode;
      throw error;
    }
  }

  static formatAllTasks(tasks) {
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
  }
}

export default TaskService;
