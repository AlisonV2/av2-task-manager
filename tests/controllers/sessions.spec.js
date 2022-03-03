import request from 'supertest';
import app from '../fixtures/app';
import { connect, disconnect, clear } from '../fixtures/database';
import { createUser, createAccessToken, deleteUser } from '../fixtures/users';

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

    expect(response.body.data.user).toBe('User1');
    expect(response.body.data.access).toBeTruthy();
  });

  test('Should return an error if user not found', async () => {
    const response = await request(app)
      .post('/api/sessions')
      .send({
        email: 'error@test.com',
        password: 'test123456',
      })
      .expect(404);

    expect(response.body.message).toBe('User not found');
  });

  test('Should log user out', async () => {
    const { token } = await createAccessToken();
    const response = await request(app)
      .get('/api/sessions')
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect(200);

    expect(response.body.message).toBe('User logged out successfully');
  });

  test('Should throw an error if no authorization token is provided', async () => {
    const response = await request(app).get('/api/sessions').send().expect(401);

    expect(response.body.message).toBe('Not authorized');
  });

  test('Should throw an error if no user is found', async () => {
    const { user, token } = await createAccessToken();
    await deleteUser(user._id);

    const response = await request(app)
      .get('/api/sessions')
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect(404);

    expect(response.body.message).toBe('User not found');
  });
});
