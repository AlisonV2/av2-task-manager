import request from 'supertest';
import app from '../src/app';
import { connect, disconnect, clear } from './fixtures/database';


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
