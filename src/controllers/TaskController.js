import TaskService from '../services/TaskService';
import LinksGenerator from '../helpers/LinksGenerator';

export default class TaskController {
  static async createTask(req, res) {
    try {
      const newTask = await TaskService.createTask(req.user, req.body);
      const links = LinksGenerator.generateLinks('singleTask', newTask.id);
      res.status(201).json({ ...newTask, links });
    } catch (err) {
      res.status(err.statusCode).json(err.message);
    }
  }

  static async updateTask(req, res) {
    try {
      const updatedTask = await TaskService.updateTask(
        req.user,
        req.params.id,
        req.body
      );
      const links = LinksGenerator.generateLinks('singleTask', req.params.id);
      res.status(200).json({ ...updatedTask, links });
    } catch (err) {
      res.status(err.statusCode).json(err.message);
    }
  }

  static async getTaskById(req, res) {
    try {
      const task = await TaskService.getTaskById(req.user, req.params.id);
      const links = LinksGenerator.generateLinks('singleTask', req.params.id);
      res.status(200).json({ ...task, links });
    } catch (err) {
      res.status(err.statusCode).json(err.message);
    }
  }

  static async deleteTask(req, res) {
    try {
      await TaskService.deleteTask(req.user, req.params.id);
      res.status(204).send();
    } catch (err) {
      res.status(err.statusCode).json(err.message);
    }
  }

  static async getTasks(req, res) {
    try {
      const filters = req.query;
      const tasks = await TaskService.getTasks(req.user, filters);

      for (let task in tasks) {
        const links = LinksGenerator.generateLinks('singleTask', tasks[task].id);
        tasks[task] = { ...tasks[task], links };
      }
      const allLinks = LinksGenerator.generateLinks('allTasks');
      res.status(200).json({ tasks, links: allLinks });
    } catch (err) {
      res.status(err.statusCode).json(err.message);
    }
  }
}