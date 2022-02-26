import { connect, disconnect, clear } from './fixtures/database';
import TaskService from '../src/services/TaskService';
import { createTask } from './fixtures/tasks';

beforeAll(async () => connect());
beforeEach(async () => clear());
afterAll(async () => disconnect());

const user = {
  id: '5f0b8b9f9d7d3b3d3c7f2f0f',
  role: 'user'
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
    });

    expect(updatedTask.title).toBe('Updated Task');
    expect(updatedTask.description).toBe('Updated Task Description');
    expect(updatedTask.status).toBe('completed');
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
    const formattedTask = TaskService.formatTask(createdTask);

    expect(formattedTask.id).toBe(createdTask._id);
  });

  test('Should get all tasks', async () => {
    const createdTask = await createTask();
    const foundTasks = await TaskService.getTasks(user);

    expect(foundTasks.length).toBe(1);
    expect(foundTasks[0].title).toBe(createdTask.title);
    expect(foundTasks[0].description).toBe(createdTask.description);
    expect(foundTasks[0].status).toBe('pending');
  })

  test('Should throw error when updating task that does not exist', async () => {
    const id = '5f0b8b9f9d7d3b3d3c7f2f0f';
    const task = {
      title: 'Test task',
      description: 'Test description',
    };

    try {
      await TaskService.updateTask(user, id, task);
    } catch (err) {
      expect(err.message).toBe('Task not found');
      expect(err.statusCode).toBe(404);
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
      await TaskService.getTasks(user);
    } catch (err) {
      expect(err.message).toBe('No tasks found');
      expect(err.statusCode).toBe(404);
    }
  })
});
