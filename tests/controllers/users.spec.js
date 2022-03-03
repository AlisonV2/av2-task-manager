import request from 'supertest';
import app from '../fixtures/app';
import { connect, disconnect, clear } from '../fixtures/database';
import { createUser, createAccessToken, deleteUser } from '../fixtures/users';
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

  test('Should update an existing user', async () => {
    const { token } = await createAccessToken();

    const response = await request(app)
      .put('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'UpdatedUser',
      })
      .expect(200);

    expect(response.body.data.name).toBe('UpdatedUser');
  });

  test('Should delete a user', async () => {
    const { token } = await createAccessToken();
    const response = await request(app)
        .delete('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    
    expect(response.body.message).toBe('User deleted successfully');
    }
  );

  test('Should get a specific user', async () => {
    const { user, token } = await createAccessToken();
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect(200);

    expect(response.body.data.name).toBe(user.name);
  })

  test('Should throw an error if the user does not exist', async () => {
    const { user, token } = await createAccessToken();
    await deleteUser(user._id)
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect(404);

    expect(response.body.message).toBe('User not found');
  })

  test('Should throw an error if deleting user fails', async () => {
    const { user, token } = await createAccessToken();
    await deleteUser(user._id)
    const response = await request(app)

      .delete('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(400);

    expect(response.body.message).toBe('Error deleting user');
  })

});
