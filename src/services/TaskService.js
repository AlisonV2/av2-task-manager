import Task from '../models/Task';

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
      const newTask = new Task({
        title: task.title,
        description: task.description,
        status: task.status,
        user: user.id,
      });

      return await newTask.save();
    } catch (err) {
      const error = new Error('Error creating task');
      error.statusCode = 400;
      throw error;
    }
  }

  static async updateTask(user, id, task) {
    try {
      const updatedTask = await Task.findOne({ _id: id, user: user.id });

      if (!updatedTask) {
        const error = new Error('Task not found');
        error.statusCode = 404;
        throw error;
      }

      updatedTask.title = task.title;
      updatedTask.description = task.description;
      updatedTask.status = task.status;

      const savedTask = await updatedTask.save();

      return this.formatTask(savedTask);
    } catch (err) {
      const error = new Error(err.message);
      error.statusCode = err.statusCode;
      throw error;
    }
  }

  static async getTaskById(user, id) {
    try {
      const task = await Task.findOne({ _id: id, user: user.id });

      if (!task) {
        const error = new Error('Task not found');
        error.statusCode = 404;
        throw error;
      }

      return this.formatTask(task);
    } catch (err) {
      const error = new Error(err.message);
      error.statusCode = err.statusCode;
      throw error;
    }
  }

  static async deleteTask(user, id) {
    try {
      const task = await Task.findOneAndDelete({ _id: id, user: user.id });

      if (!task) {
        const error = new Error('Task not found');
        error.statusCode = 404;
        throw error;
      }
 
      return 'Task deleted successfully';
    } catch (err) {
      const error = new Error(err.message);
      error.statusCode = err.statusCode;
      throw error;
    }
  }

  static async getTasks(user) {
    try {
      let formattedTasks = [];
      const tasks = await Task.find({ user: user.id});

      if (!tasks.length) {
        const error = new Error('No tasks found');
        error.statusCode = 404;
        throw error;
      }

      for (let i in tasks) {
        formattedTasks.push(this.formatTask(tasks[i]));
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
