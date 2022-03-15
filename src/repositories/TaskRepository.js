import Task from '../models/Task';

class TaskRepository {
  static formatTask(task, userName) {
    console.log(userName)
    return {
      id: task._id,
      title: task.title,
      description: task.description,
      status: task.status,
      time: task.time,
      author: userName
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
      if (key === 'time') updatedTask[key] += task[key];
      else updatedTask[key] = task[key];
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

  static async deleteUserTasks(id) {
    return Task.deleteMany({ user: id });
  }
}

export default TaskRepository;
