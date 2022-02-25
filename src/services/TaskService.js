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
  static async createTask(task) {
    try {
      const newTask = new Task({
        title: task.title,
        description: task.description,
        status: task.status,
      });

      const createdTask = await newTask.save();
      return createdTask._id;
    } catch (err) {
      const error = new Error('Error creating task');
      error.statusCode = 500;
      throw error;
    }
  }

  static async updateTask(id, task) {
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
      const error = new Error('Error updating task');
      error.statusCode = 500;
      throw error;
    }
  }

  static async getTaskById(id) {
    try {
      const task = await Task.findOne({ _id: id });
      if (!task) {
        const error = new Error('Task not found');
        error.statusCode = 404;
        throw error;
      }

      return this.formatTask(task);
    } catch (err) {
      const error = new Error('Error getting task');
      error.statusCode = 500;
      throw error;
    }
  }

  static async deleteTask(id) {
    try {
      const deletedTask = await Task.findOneAndDelete({ _id: id });
      if (!deletedTask) {
        const error = new Error('Task not found');
        error.statusCode = 404;
        throw error;
      }

      return this.formatTask(deletedTask);
    } catch (err) {
      const error = new Error('Error deleting task');
      error.statusCode = 500;
      throw error;
    }
  }

  static async getTasks() {
    try {
      let formattedTasks = [];
      const tasks = await Task.find();
      for (let i in tasks) {
        formattedTasks.push(this.formatTask(tasks[i]));
      }
      return formattedTasks;
    } catch (err) {
      const error = new Error('Error getting tasks');
      error.statusCode = 500;
      throw error;
    }
  }
}

export default TaskService;
