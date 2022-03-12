import { connect, disconnect, clear } from '../fixtures/database';
import TaskService from '../../src/services/TaskService';
import CacheService from '../../src/services/CacheService';
import {
  createTask,
  createManyTasks,
  createAdminTasks,
} from '../fixtures/tasks';

const cache = new CacheService(3000);

beforeAll(async () => connect());
beforeEach(async () => {
  await clear();
  cache.flush();
});
afterAll(async () => disconnect());

const user = {
  id: '5f0b8b9f9d7d3b3d3c7f2f0f',
  role: 'user',
};

const admin = {
  id: '5f0b8sdfd7d3b3d3c7f2f0f',
  role: 'admin',
};

describe('Task Service', () => {
  test('Should create a new Task', async () => {
    const task = {
      title: 'Test task',
      description: 'Test description',
    };

    const createdTask = await TaskService.createTask(user, task);

    expect(createdTask.title).toBe(task.title);
    expect(createdTask.description).toBe(task.description);
    expect(createdTask.status).toBe('pending');
  });

  test('Should update task', async () => {
    const createdTask = await createTask();

    const updatedTask = await TaskService.updateTask(user, createdTask._id, {
      title: 'Updated Task',
      description: 'Updated Task Description',
      status: 'completed',
      time: 5,
    });

    expect(updatedTask.title).toBe('Updated Task');
    expect(updatedTask.description).toBe('Updated Task Description');
    expect(updatedTask.status).toBe('completed');
  });

  test('Should throw an error if time is not supplied when completing a task', async () => {
    const createdTask = await createTask();
    try {
      await TaskService.updateTask(user, createdTask._id, {
        title: 'Updated Task',
        description: 'Updated Task Description',
        status: 'completed',
      });
    } catch (err) {
      expect(err.message).toBe('Error updating task');
    }
  });

  test('Should get task by id', async () => {
    const createdTask = await createTask();
    const foundTask = await TaskService.getTaskById(user, createdTask._id);

    expect(foundTask.title).toBe(createdTask.title);
    expect(foundTask.description).toBe(createdTask.description);
    expect(foundTask.status).toBe('pending');
  });

  test('Should delete task', async () => {
    const createdTask = await createTask();
    const deletedTask = await TaskService.deleteTask(user, createdTask._id);

    expect(deletedTask).toBe('Task deleted successfully');
  });

  test('Should return properly formatted task', async () => {
    const createdTask = await createTask();
    expect(createdTask.id).toBeTruthy();
  });

  test('Should get all tasks', async () => {
    const createdTask = await createTask();
    const foundTasks = await TaskService.getTasks(user, {});

    expect(foundTasks.length).toBe(1);
    expect(foundTasks[0].title).toBe(createdTask.title);
    expect(foundTasks[0].description).toBe(createdTask.description);
    expect(foundTasks[0].status).toBe('pending');
  });

  test('Should throw error when updating task that does not exist', async () => {
    const id = '5f0b8b9f9d7d3b3d3c7f2f0f';
    const task = {
      title: 'Test task',
      description: 'Test description',
    };

    try {
      await TaskService.updateTask(user, id, task);
    } catch (err) {
      expect(err.message).toBe('Error updating task');
      expect(err.statusCode).toBe(400);
    }
  });

  test('Should throw error when updating task with invalid fields', async () => {
    try {
      const createdTask = await createTask();

      await TaskService.updateTask(user, createdTask._id, {
        id: 'test123456',
        description: 'Updated Task Description',
        status: 'completed',
      });
    } catch (err) {
      expect(err.message).toBe('Invalid updates');
      expect(err.statusCode).toBe(409);
    }
  });

  test('Should throw error when getting task that does not exist', async () => {
    const id = '5f0b8b9f9d7d3b3d3c7f2f0f';

    try {
      await TaskService.getTaskById(user, id);
    } catch (err) {
      expect(err.message).toBe('Task not found');
      expect(err.statusCode).toBe(404);
    }
  });

  test('Should throw error when deleting task that does not exist', async () => {
    const id = '5f0b8b9f9d7d3b3d3c7f2f0f';

    try {
      await TaskService.deleteTask(user, id);
    } catch (err) {
      expect(err.message).toBe('Task not found');
      expect(err.statusCode).toBe(404);
    }
  });

  test('Should throw error when creating task with invalid data', async () => {
    const task = {
      description: 'Test description',
    };

    try {
      await TaskService.createTask(user, task);
    } catch (err) {
      expect(err.message).toBe('Error creating task');
      expect(err.statusCode).toBe(400);
    }
  });

  test('Should throw error when no tasks are found', async () => {
    try {
      await TaskService.getTasks(user, {});
    } catch (err) {
      expect(err.message).toBe('No tasks found');
      expect(err.statusCode).toBe(404);
    }
  });

  test('Should get tasks where status is pending', async () => {
    const createdTask = await createTask();
    const foundTasks = await TaskService.getTasks(user, { status: 'pending' });

    expect(foundTasks.length).toBe(1);
    expect(foundTasks[0].title).toBe(createdTask.title);
    expect(foundTasks[0].description).toBe(createdTask.description);
    expect(foundTasks[0].status).toBe('pending');
  });

  test('Should return an empty array as no task is completed', async () => {
    await createTask();
    try {
      await TaskService.getTasks(user, { status: 'completed' });
    } catch (err) {
      expect(err.message).toBe('No tasks found');
      expect(err.statusCode).toBe(404);
    }
  });

  test('Should return filtered tasks', async () => {
    await createManyTasks();
    const foundTasks = await TaskService.getTasks(user, { status: 'pending' });

    expect(foundTasks.length).toBe(2);
  });

  test('Should return reversed-ordered tasks', async () => {
    await createManyTasks();
    const foundTasks = await TaskService.getTasks(user, { sort: 'title:desc' });
    expect(foundTasks[0].title).toBe('F - New task');
  });

  test('Should return ordered tasks', async () => {
    await createManyTasks();
    const foundTasks = await TaskService.getTasks(user, { sort: 'title:asc' });
    expect(foundTasks[0].title).toBe('A - New task');
  });

  test('Should return limited tasks', async () => {
    await createManyTasks();
    const foundTasks = await TaskService.getTasks(user, { limit: 3 });
    expect(foundTasks[0].title).toBe('A - New task');
    expect(foundTasks.length).toBe(3);
  });

  test('Should return paginated tasks', async () => {
    await createManyTasks();
    const foundTasks = await TaskService.getTasks(user, { page: 2, limit: 3 });
    expect(foundTasks[0].title).toBe('D - New task');
    expect(foundTasks.length).toBe(3);
  });

  test('Should throw an error if user role is not admin', async () => {
    await createTask();
    try {
      await TaskService.getTasks(user, {
        admin: true,
        user: '5f0b8b9f9d7d3b3d3c7f2f0f',
      });
    } catch (err) {
      expect(err.message).toBe('Forbidden filters');
      expect(err.statusCode).toBe(403);
    }
  });

  test('Should get tasks for admin as simple user', async () => {
    await createAdminTasks();
    const foundTasks = await TaskService.getTasks(admin, {});

    expect(foundTasks.length).toBe(2);
  });

  test('Should get all tasks for with admin view', async () => {
    await createAdminTasks();
    const foundTasks = await TaskService.getTasks(admin, { admin: true });

    expect(foundTasks.length).toBe(6);
    expect(foundTasks[0].title).toBe('A - New task');
  });

  test('Should get user tasks for with admin view', async () => {
    await createAdminTasks();
    const foundTasks = await TaskService.getTasks(admin, {
      admin: true,
      user: user.id,
    });

    expect(foundTasks.length).toBe(4);
  });

  test('Should get user tasks without admin view', async () => {
    await createAdminTasks();
    const foundTasks = await TaskService.getTasks(user, {});
    expect(foundTasks.length).toBe(4);
  });

  test('Should get task by id from cache', async () => {
    const createdTask = await createTask();
    await TaskService.getTaskById(user, createdTask._id);
    const foundTask = await TaskService.getTaskById(user, createdTask._id);

    expect(foundTask.title).toBe(createdTask.title);
    expect(foundTask.description).toBe(createdTask.description);
    expect(foundTask.status).toBe('pending');
  });
});
