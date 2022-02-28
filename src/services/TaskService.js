import TaskRepository from '../repositories/TaskRepository';

class TaskService {
  static formatTask(task) {
    return {
      id: task._id,
      title: task.title,
      description: task.description,
      status: task.status,
    };
  }
  static async createTask(user, task) {
    try {
      const newTask = {
        title: task.title,
        description: task.description,
        status: task.status,
        user: user.id,
      };

      const createdTask = await TaskRepository.createTask(newTask);
      return this.formatTask(createdTask);
    } catch (err) {
      const error = new Error('Error creating task');
      error.statusCode = 400;
      throw error;
    }
  }

  static async updateTask(user, id, task) {
    try {
      const query = { _id: id, user: user.id };
      const updatedTask = await TaskRepository.updateTask(query, task);

      return this.formatTask(updatedTask);
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

      return this.formatTask(task);
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
  // status: 'pending' | 'completed' | 'in-progress'

  static async getTasks(user, filters) {
    try {
      let match = { user: user.id };
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
        throw new Error('No tasks found');
      }

      let formattedTasks = [];
      for (let i in tasks) {
        formattedTasks.push(this.formatTask(tasks[i]));
      }
      return formattedTasks;
    } catch (err) {
      const error = new Error('No tasks found');
      error.statusCode = 404;
      throw error;
    }
  }
}

export default TaskService;
