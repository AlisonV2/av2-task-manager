import Task from '../models/Task';

class TaskRepository {
  static async createTask(task) {
    const newTask = new Task({
      ...task,
    });

    return newTask.save();
  }

  static async findTask(query) {
    return Task.findOne({ ...query });
  }

  static async updateTask(query, task) {
    const updatedTask = await this.findTask(query);

    Object.keys(task).forEach((key) => {
      updatedTask[key] = task[key];
    });

    return updatedTask.save();
  }

  static async deleteTask(query) {
    return Task.findOneAndDelete({ ...query });
  }
}

export default TaskRepository;
