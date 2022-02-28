import TaskService from '../services/TaskService';

class TaskController {
  static async createTask(req, res) {
    try {
      const newTask = await TaskService.createTask(req.user, req.body);
      res
        .status(201)
        .json({ message: 'Task created successfully', data: newTask._id });
    } catch (err) {
      res.status(err.statusCode).json({ message: err.message });
    }
  }

  static async updateTask(req, res) {
    try {
      // add req.user
      const updatedTask = await TaskService.updateTask(
        req.user,
        req.params.id,
        req.body
      );
      res
        .status(200)
        .json({ message: 'Task updated successfully', data: updatedTask });
    } catch (err) {
      res.status(err.statusCode).json({ message: err.message });
    }
  }

  static async getTaskById(req, res) {
    try {
      const task = await TaskService.getTaskById(req.user, req.params.id);
      res.status(200).json({ data: task });
    } catch (err) {
      res.status(err.statusCode).json({ message: err.message });
    }
  }

  static async deleteTask(req, res) {
    try {
      const deletedTask = await TaskService.deleteTask(req.user, req.params.id);
      res.status(200).json({ message: deletedTask });
    } catch (err) {
      res.status(err.statusCode).json({
        message: err.message,
      });
    }
  }

  static async getTasks(req, res) {
    try {
      const filters = req.query;
      const tasks = await TaskService.getTasks(req.user, filters);
      res.status(200).json({ data: tasks });
    } catch (err) {
      res.status(err.statusCode).json({
        message: err.message,
      });
    }
  }
}

export default TaskController;
