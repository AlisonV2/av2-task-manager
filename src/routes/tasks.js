import express from 'express';
import TaskController from '../controllers/TaskController';
import authenticate from '../middleware/authenticate';

const router = express.Router();

// GET /tasks?status=pending ||in-progress || completed
// GET /tasks?page=2&limit=10
// GET /tasks?status=pending&sort=title:asc
// GET /tasks?admin=true

router
    .post('/', authenticate, TaskController.createTask)
    .get('/', authenticate, TaskController.getTasks)
    .get('/:id', authenticate, TaskController.getTaskById)
    .put('/:id', authenticate, TaskController.updateTask)
    .delete('/:id', authenticate, TaskController.deleteTask);

export { router as tasksRouter };
