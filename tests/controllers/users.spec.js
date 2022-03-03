import request from 'supertest';
import app from '../fixtures/app';
import { connect, disconnect, clear } from '../fixtures/database';
import { createUser } from '../fixtures/users';
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
});
