import express from 'express';
import TaskController from '../controllers/TaskController';

const router = express.Router();

router
    .post('/', TaskController.createTask)
    .get('/', TaskController.getTasks)
    .get('/:id', TaskController.getTaskById)
    .put('/:id', TaskController.updateTask)
    .delete('/:id', TaskController.deleteTask);

export { router as tasksRouter };
