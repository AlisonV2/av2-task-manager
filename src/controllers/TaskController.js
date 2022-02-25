import TaskService from '../services/TaskService';

class TaskController {
  static async createTask(req, res) {
    try {
      const newTask = await TaskService.createTask(req.body);
      res
        .status(201)
        .json({ message: 'Task created successfully', task_id: newTask._id });
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async updateTask(req, res) {
    try {
      const updatedTask = await TaskService.updateTask(req.params.id, req.body);
      res.status(200).json(updatedTask);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async getTaskById(req, res) {
    try {
      const task = await TaskService.getTaskById(req.params.id);
      res.status(200).json(task);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async deleteTask(req, res) {
    try {
      const deletedTask = await TaskService.deleteTask(req.params.id);
      res.status(200).json(deletedTask);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async getTasks(req, res) {
    try {
      const tasks = await TaskService.getTasks();
      res.status(200).json(tasks);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}

export default TaskController;
