import express from 'express';
import TaskController from '../controllers/TaskController';
import auth from '../middleware/auth';

const router = express.Router();

// GET /tasks?status=pending||in-progress || completed
// GET /tasks?limit=10&skip=20 - pagination /tasks?page=2&limit=10
// GET Example: filter & sort /tasks?status=pending&sortBy=title:asc
router
    .post('/', auth, TaskController.createTask)
    .get('/', TaskController.getTasks)
    .get('/:id', auth, TaskController.getTaskById)
    .put('/:id', auth, TaskController.updateTask)
    .delete('/:id', auth, TaskController.deleteTask);

export { router as tasksRouter };
