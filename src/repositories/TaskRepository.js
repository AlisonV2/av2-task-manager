import Task from '../models/Task';

class TaskRepository {
  static formatTask(task) {
    return {
      id: task._id,
      title: task.title,
      description: task.description,
      status: task.status,
    };
  }
  
  static async createTask(task) {
    const newTask = new Task({
      ...task,
    });

    return newTask.save();
  }

  static async getTask(query) {
    return Task.findOne({ ...query });
  }

  static async updateTask(query, task) {
    const updatedTask = await this.getTask(query);

    Object.keys(task).forEach((key) => {
      updatedTask[key] = task[key];
    });

    return updatedTask.save();
  }

  static async deleteTask(query) {
    return Task.findOneAndDelete({ ...query });
  }

  static async getTasks(match, sort, skip, limit) {
    return Task
    .find({ ...match })
    .sort({ ...sort })
    .skip(skip)
    .limit(limit);
  }
}

export default TaskRepository;
