import express from 'express';
import TaskController from '../controllers/TaskController';
import auth from '../middleware/auth';

const router = express.Router();

// GET /tasks?status=pending||in-progress || completed
// GET /tasks?page=2&limit=10
// GET /tasks?status=pending&sort=title:asc
router
    .post('/', auth, TaskController.createTask)
    .get('/', auth, TaskController.getTasks)
    .get('/:id', auth, TaskController.getTaskById)
    .put('/:id', auth, TaskController.updateTask)
    .delete('/:id', auth, TaskController.deleteTask);

export { router as tasksRouter };
