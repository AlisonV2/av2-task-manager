import request from 'supertest';
import app from '../fixtures/app';
import { connect, disconnect, clear } from '../fixtures/database';
import { createUser, deleteUser, createLoggedUser, createLoggedAdmin } from '../fixtures/users';
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
    const { accessToken } = await createLoggedUser();

    const response = await request(app)
      .put('/api/users/current')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'UpdatedUser',
      })
      .expect(200);

    expect(response.body.name).toBe('UpdatedUser');
  });

  test('Should throw an error when fields are invalid', async () => {
    const { accessToken } = await createLoggedUser();

    const response = await request(app)
      .put('/api/users/current')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        id: 'user123456',
      })
      .expect(422);

    expect(response.body).toBe('Invalid updates');
  });

  test('Should delete a user', async () => {
    const { accessToken } = await createLoggedUser();
    await request(app)
      .delete('/api/users/current')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204);
  });

  test('Should get a specific user', async () => {
    const { updatedUser, accessToken } = await createLoggedUser();
    const response = await request(app)
      .get('/api/users/current')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
      .expect(200);

    expect(response.body.name).toBe(updatedUser.name);
  });

  test('Should throw an error in middleware if the user does not exist', async () => {
    const { updatedUser, accessToken } = await createLoggedUser();
    await deleteUser(updatedUser._id);
    const response = await request(app)
      .get('/api/users/current')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
      .expect(401);

    expect(response.body).toBe('Not authorized');
  });

  test('Should throw an error if deleting user fails', async () => {
    const { updatedUser, accessToken } = await createLoggedUser();
    await deleteUser(updatedUser._id);
    const response = await request(app)
      .delete('/api/users/current')
      .set('Authorization', `Bearer ${accessToken}`)
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
    const { accessToken } = await createLoggedAdmin();
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
      .expect(200);

    expect(response.body.length).toBe(1);
  })

  test('Should throw an error if not admin', async () => {
    const { accessToken } = await createLoggedUser();
    await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
      .expect(403);
  })
});
