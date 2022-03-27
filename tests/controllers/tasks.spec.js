import request from 'supertest';
import app from '../fixtures/app';
import { connect, disconnect, clear } from '../fixtures/database';
import { createLoggedUser } from '../fixtures/users';
import { createUserTask, createManyUserTasks } from '../fixtures/tasks';

beforeAll(async () => connect());
beforeEach(async () => clear());
afterAll(async () => disconnect());

describe('Task routes', () => {
  test('Should return newly created task', async () => {
    const { accessToken } = await createLoggedUser();
    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Test task',
        description: 'Test description',
      })
      .expect(201);

    expect(response.body.id).not.toBeNull();
  });

  test('Should return an error when data is invalid', async () => {
    const { accessToken } = await createLoggedUser();
    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        description: 'Test description',
      })
      .expect(422);

    expect(response.body).toBe('Missing required fields');
  });

  test('Should get task by id', async () => {
    const { updatedUser, accessToken } = await createLoggedUser();
    const task = await createUserTask(updatedUser._id);
    const response = await request(app)
      .get(`/api/tasks/${task._id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    expect(response.body.title).toBe(task.title);
  });

  test('Should throw an error when task not found', async () => {
    const { accessToken } = await createLoggedUser();
    const response = await request(app)
      .get('/api/tasks/1213')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);
      expect(response.body).toBe('Task not found');
  });

  test('Should update a task', async () => {
    const { updatedUser, accessToken } = await createLoggedUser();
    const task = await createUserTask(updatedUser._id);

    const response = await request(app)
      .put(`/api/tasks/${task._id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Updated task',
      })
      .expect(200);

    expect(response.body.title).toBe('Updated task');
  });

  test('Should throw an error when failing to update task', async () => {
    const { updatedUser, accessToken } = await createLoggedUser();
    await createUserTask(updatedUser._id);

    const response = await request(app)
      .put('/api/tasks/121374')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Updated task',
      })
      .expect(400);

    expect(response.body).toBe('Error updating task');
  });

  test('Should delete a task', async () => {
    const { updatedUser, accessToken } = await createLoggedUser();
    const task = await createUserTask(updatedUser._id);

    await request(app)
      .delete(`/api/tasks/${task._id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204);
  });

  test('Should throw an error when deleting a task failed', async () => {
    const { updatedUser, accessToken } = await createLoggedUser();
    await createUserTask(updatedUser._id);

    const response = await request(app)
      .delete('/api/tasks/1234')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);

      expect(response.body).toBe('Task not found');
  });

  test('Should get all tasks', async () => {
    const { updatedUser, accessToken } = await createLoggedUser(); 
    const tasks = await createManyUserTasks(updatedUser._id);

    const response = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.tasks.length).toBe(tasks.length);
    expect(response.body.tasks[0].title).toBe(tasks[0].title);
  });

  test('Should get all completed tasks', async () => {
    const { updatedUser, accessToken } = await createLoggedUser(); 
    await createManyUserTasks(updatedUser._id);

    const response = await request(app)
      .get('/api/tasks?status=completed')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.tasks.length).toBe(2);
  })

  test('Should get all pending tasks by ASC order', async () => {
    const { updatedUser, accessToken } = await createLoggedUser(); 
    await createManyUserTasks(updatedUser._id);

    const response = await request(app)
      .get('/api/tasks?status=pending&sort=title:asc')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.tasks.length).toBe(2);
    expect(response.body.tasks[0].title).toBe('B - New task');
  })

  test('Should get all pending tasks by DESC order', async () => {
    const { updatedUser, accessToken } = await createLoggedUser(); 
    await createManyUserTasks(updatedUser._id);

    const response = await request(app)
      .get('/api/tasks?status=pending&sort=title:desc')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.tasks.length).toBe(2);
    expect(response.body.tasks[0].title).toBe('D - New task');
  })

  test('Should return the first 3 tasks', async () => {
    const { updatedUser, accessToken } = await createLoggedUser(); 
    await createManyUserTasks(updatedUser._id);

    const response = await request(app)
      .get('/api/tasks?limit=3')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.tasks.length).toBe(3);
    expect(response.body.tasks[0].title).toBe('A - New task');
  })

  test('Should return the next 3 tasks', async () => {
    const { updatedUser, accessToken } = await createLoggedUser(); 
    await createManyUserTasks(updatedUser._id);

    const response = await request(app)
      .get('/api/tasks?page=2&limit=3')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.tasks.length).toBe(3);
    expect(response.body.tasks[0].title).toBe('D - New task');
  })

  test('Should throw an error when no tasks found', async () => {
    const { updatedUser, accessToken } = await createLoggedUser(); 
    await createUserTask(updatedUser._id);

    const response = await request(app)
      .get('/api/tasks?status=completed')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);

    expect(response.body).toBe('No tasks found');
  });

  test('Should throw an error when token is invalid', async () => {
    const response = await request(app)
      .delete('/api/tasks/1234')
      .set('Authorization', `Bearer invalid-token`)
      .expect(401);

      expect(response.body).toBe('Not authorized');
  });
});
