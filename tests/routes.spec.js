import request from 'supertest';
import app from './fixtures/app';

describe('Task routes', () => {
  test('Should return newly created task', () => {
    request(app)
      .post('/api/tasks')
      .send({
        title: 'Test task',
        description: 'Test description',
      })
      .expect(201);
  });
});
