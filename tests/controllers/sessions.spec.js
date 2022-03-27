import request from 'supertest';
import app from '../fixtures/app';
import { connect, disconnect, clear } from '../fixtures/database';
import {
  createUser,
  createAccessToken,
  deleteUser,
  createLoggedUser,
} from '../fixtures/users';
import SessionController from '../../src/controllers/SessionController';

beforeAll(async () => connect());
beforeEach(async () => clear());
afterAll(async () => disconnect());

describe('Session routes', () => {
  test('Should log user in', async () => {
    const user = await createUser();
    const response = await request(app)
      .post('/api/sessions')
      .send({
        email: user.email,
        password: 'test123456',
      })
      .expect(200);

    expect(response.body.user).toBe('User1');
    expect(response.body.access).toBeTruthy();
    
  });

  test('Should return a quote when logging in', async () => {
    const user = await createUser();
    const response = await request(app)
      .post('/api/sessions')
      .send({
        email: user.email,
        password: 'test123456',
      })
      .expect(200);

    expect(response.body.quote).toBeTruthy();   
  });

  test('Should return an error if user not found', async () => {
    const response = await request(app)
      .post('/api/sessions')
      .send({
        email: 'error@test.com',
        password: 'test123456',
      })
      .expect(404);

    expect(response.body).toBe('User not found');
  });

  test('Should log user out', async () => {
    const { accessToken } = await createLoggedUser();
    await request(app)
      .delete('/api/sessions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
      .expect(204);
  });

  test('Should throw an error if no authorization token is provided', async () => {
    const response = await request(app)
      .delete('/api/sessions')
      .send()
      .expect(401);

    expect(response.body).toBe('Not authorized');
  });

  test('Should throw an error if no user is found', async () => {
    const { user, token } = await createAccessToken();
    await deleteUser(user._id);

    const response = await request(app)
      .delete('/api/sessions')
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect(401);

    expect(response.body).toBe('Not authorized');
  });

  test('Should throw an error if user is not logged in', async () => {
    const { token } = await createAccessToken();
    await request(app)
      .delete('/api/sessions')
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect(401);
  });

  test('Controller should throw an error',async () =>  {
    try {
      await SessionController.logout({}, {});
    } catch(err) {
      expect(err.message).toBeTruthy();
      expect(err.statusCode).toBe(undefined)
    }
  })
});
