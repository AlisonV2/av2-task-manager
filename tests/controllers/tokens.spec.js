import request from 'supertest';
import app from '../fixtures/app';
import { connect, disconnect, clear } from '../fixtures/database';
import { createUser, createUserToken } from '../fixtures/users';

beforeAll(async () => connect());
beforeEach(async () => clear());
afterAll(async () => disconnect());

describe('Token routes', () => {
  test('Should refresh access token', async () => {
    const user = await createUser();
    const loggedUser = await request(app)
      .post('/api/sessions')
      .send({
        email: user.email,
        password: 'test123456',
      })
      .expect(200);

    const { refresh } = loggedUser.body;

    const response = await request(app)
      .post('/api/tokens')
      .send({
        refresh,
      })
      .expect(200);

    expect(response.body.access).toBeTruthy();
  });

  test('Should return an error if no refresh token is provided', async () => {
    const response = await request(app)
      .post('/api/tokens')
      .send()
      .expect(401);

    expect(response.body).toBe('Not authenticated');
  });

  test('Should verify user email', async () => {
    const { token } = await createUserToken();
    await request(app)
      .get(`/api/tokens/${token}`)
      .expect(200);

  })

  test('Should throw an error if token if invalid', async () => {
    const response = await request(app)
      .get('/api/tokens/invalid-token')
      .expect(404);

    expect(response.body).toBe('Invalid link');
  })
});
