import request from 'supertest';
import app from './fixtures/app';
import { connect, disconnect, clear } from './fixtures/database';
import { deleteUser, createUser, createAccessToken, createUserToken } from './fixtures/users';
import nodemailer from 'nodemailer';

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
    const response = await request(app)
      .post('/api/users')
      .send({
        email: 'user2@test.com',
        name: 'User2',
        password: 'test123456',
      })
      .expect(201);

    expect(response.body.message).toBe(
      'An email has been sent to your account. Please verify your email to complete registration.'
    );
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

    expect(response.body.message).toBe('User already exists');
  });

  test('Should log user in', async () => {
    const user = await createUser();
    const response = await request(app)
      .post('/api/users/login')
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
      .post('/api/users/login')
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
      .get('/api/users/logout')
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect(200);

    expect(response.body.message).toBe('User logged out successfully');
  });

  test('Should throw an error if no authorization token is provided', async () => {
    const response = await request(app)
      .get('/api/users/logout')
      .send()
      .expect(401);

    expect(response.body.message).toBe('Not authorized');
  });

  test('Should throw an error if no user is found', async () => {
    const { user, token } = await createAccessToken();
    await deleteUser(user._id);

    const response = await request(app)
      .get('/api/users/logout')
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect(404);

    expect(response.body.message).toBe('User not found');
  });

  test('Should refresh access token', async () => {
    const user = await createUser();
    const loggedUser = await request(app)
      .post('/api/users/login')
      .send({
        email: user.email,
        password: 'test123456',
      })
      .expect(200);

    const { refresh } = loggedUser.body.data;

    const response = await request(app)
      .post('/api/users/refresh')
      .send({
        refresh,
      })
      .expect(200);

    expect(response.body.data.access).toBeTruthy();
    expect(response.body.message).toBe('Token refreshed successfully');
  });

  test('Should return an error if no refresh token is provided', async () => {
    const response = await request(app)
      .post('/api/users/refresh')
      .send()
      .expect(401);

    expect(response.body.message).toBe('Not authenticated');
  });

  test('Should verify user email', async () => {
    const { token } = await createUserToken();
    const response = await request(app)
      .get(`/api/users/verify/${token}`)
      .expect(200);

    expect(response.body.message).toBe('Email verified successfully');
  })

  test('Should throw an error if token if invalid', async () => {
    const response = await request(app)
      .get('/api/users/verify/invalid-token')
      .expect(404);

    expect(response.body.message).toBe('Invalid link');
  })
});
