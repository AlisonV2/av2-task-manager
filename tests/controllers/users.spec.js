import request from 'supertest';
import app from '../fixtures/app';
import { connect, disconnect, clear } from '../fixtures/database';
import { createUser, createAccessToken, deleteUser, createAdminToken } from '../fixtures/users';
import nodemailer from 'nodemailer';
import UserController from '../../src/controllers/UserController';

const sendMailMock = jest
  .fn()
  .mockReturnValue('Message sent to: test@test.com');

jest.mock('nodemailer');
nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

beforeEach(async () => {
  sendMailMock.mockClear();
  nodemailer.createTransport.mockClear();
  await clear();
});

beforeAll(async () => connect());
afterAll(async () => disconnect());

describe('Users routes', () => {
  test('Should return newly created user', async () => {
    await request(app)
      .post('/api/users')
      .send({
        email: 'user2@test.com',
        name: 'User2',
        password: 'test123456',
      })
      .expect(201);
  });

  test('Should return an error if user already exist', async () => {
    const user = await createUser();
    const response = await request(app)
      .post('/api/users')
      .send({
        email: user.email,
        name: 'User2',
        password: 'test123456',
      })
      .expect(400);

    expect(response.body).toBe('User already exists');
  });

  test('Should update an existing user', async () => {
    const { token } = await createAccessToken();

    const response = await request(app)
      .put('/api/users/current')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'UpdatedUser',
      })
      .expect(200);

    expect(response.body.name).toBe('UpdatedUser');
  });

  test('Should throw an error when fields are invalid', async () => {
    const { token } = await createAccessToken();

    const response = await request(app)
      .put('/api/users/current')
      .set('Authorization', `Bearer ${token}`)
      .send({
        id: 'user123456',
      })
      .expect(422);

    expect(response.body).toBe('Invalid updates');
  });

  test('Should delete a user', async () => {
    const { token } = await createAccessToken();
    await request(app)
      .delete('/api/users/current')
      .set('Authorization', `Bearer ${token}`)
      .expect(204);
  });

  test('Should get a specific user', async () => {
    const { user, token } = await createAccessToken();
    const response = await request(app)
      .get('/api/users/current')
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect(200);

    expect(response.body.name).toBe(user.name);
  });

  test('Should throw an error in middleware if the user does not exist', async () => {
    const { user, token } = await createAccessToken();
    await deleteUser(user._id);
    const response = await request(app)
      .get('/api/users/current')
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect(401);

    expect(response.body).toBe('Not authorized');
  });

  test('Should throw an error if deleting user fails', async () => {
    const { user, token } = await createAccessToken();
    await deleteUser(user._id);
    const response = await request(app)
      .delete('/api/users/current')
      .set('Authorization', `Bearer ${token}`)
      .expect(401);

    expect(response.body).toBe('Not authorized');
  });

  test('Should throw an error in controller if error getting user', async () => {
    try {
      const user = {
        id: '1231dsf4sqdfsdds',
      };
      await UserController.getUser({ user }, {});
    } catch (err) {
      expect(err.message).toBeTruthy();
    }
  });

  test('Should throw an error in controller if deleting a user fails', async () => {
    try {
      const user = {
        id: '1231dsf4sqdfsdds',
      };
      await UserController.deleteUser({ user }, {});
    } catch (err) {
      expect(err.message).toBeTruthy();
      expect(err.statusCode).toBe(undefined);
    }
  });

  test('Should get users if admin', async () => {
    const { token } = await createAdminToken();
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect(200);

    expect(response.body.length).toBe(1);
  })

  test('Should throw an error if not admin', async () => {
    const { token } = await createAccessToken();
    await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect(403);
  })
});
