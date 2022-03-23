import TaskRepository from '../repositories/TaskRepository';
import DataValidator from '../helpers/DataValidator';
import CacheService from './CacheService';

const cache = new CacheService(3000);

class TaskService {
  static async createTask(user, task) {

      DataValidator.validateTaskFields(task);
      
      const newTask = {
        title: task.title,
        description: task.description,
        status: task.status,
        user: user.id,
      };

      const createdTask = await TaskRepository.createTask(newTask);
      cache.set(`task-${createdTask._id}`, createdTask);
      return TaskRepository.formatTask(createdTask, user.name);
  }

  static async updateTask(user, id, task) {

    DataValidator.validateUpdateFields(task, 'task');
    DataValidator.validateCompleteTask(task);

    try {
      const updatedTask = await TaskRepository.updateTask(
        { _id: id, user: user.id },
        task
      );

      cache.update(`task-${user.id}-${id}`, updatedTask);

      return TaskRepository.formatTask(updatedTask, user.name);
    } catch (err) {
      const error = new Error('Error updating task');
      error.statusCode = 400;
      throw error;
    }
  }

  static async getTaskById(user, id) {
    try {
      const cached = cache.get(`task-${user.id}-${id}`);

      if (cached) return TaskRepository.formatTask(cached);

      const task = await TaskRepository.getTask({ _id: id, user: user.id });
      cache.set(`task-${user.id}-${id}`, task);
      return TaskRepository.formatTask(task, user.name);
    } catch (err) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }
  }

  static async deleteTask(user, id) {
    try {
      await TaskRepository.deleteTask({ _id: id, user: user.id });
      cache.del(`task-${user.id}-${id}`);

      return 'Task deleted successfully';
    } catch (err) {
      const error = new Error('Task not found');
      error.statusCode = 404;
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

  static async getTasks(user, filters) {
    try {
      DataValidator.validateFilters(user, filters);

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

      const tasks = await TaskRepository.getTasks(match, sort, skip, limit);
      return this.formatAllTasks(tasks, user.name);
    } catch (err) {
      const error = new Error(err.message);
      error.statusCode = err.statusCode;
      throw error;
    }
  }

  static formatAllTasks(tasks, userName) {
    DataValidator.isEmptyData(tasks, 'tasks');

    let formattedTasks = [];
    for (let i in tasks) {
      formattedTasks.push(TaskRepository.formatTask(tasks[i], userName));
    }
    return formattedTasks;
  }
}

export default TaskService;
