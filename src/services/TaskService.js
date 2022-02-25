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
      const userId = user.id;
      const newTask = new Task({
        title: task.title,
        description: task.description,
        status: task.status,
        user: userId,
      });

      return await newTask.save();
    } catch (err) {
      const error = new Error('Error creating task');
      error.statusCode = 400;
      throw error;
    }
  }

  static async updateTask(id, task) {
    // update to include user
    try {
      const updatedTask = await Task.findByIdAndUpdate(
        id,
        {
          title: task.title,
          description: task.description,
          status: task.status,
        },
        { useFindAndModify: false, new: false }
      );

      if (!updatedTask) {
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

  static async getTaskById(id) {
    // update to include user
    try {
      const task = await Task.findOne({ _id: id });
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

  static async deleteTask(id) {
    // update to include user
    try {
      const deletedTask = await Task.findOneAndDelete({ _id: id });
      if (!deletedTask) {
        const error = new Error('Task not found');
        error.statusCode = 404;
        throw error;
      }

      return this.formatTask(deletedTask);
    } catch (err) {
      const error = new Error(err.message);
      error.statusCode = err.statusCode;
      throw error;
    }
  }

  static async getTasks() {
    // update to include user
    try {
      let formattedTasks = [];
      const tasks = await Task.find();

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
