import { connect, disconnect, clear } from '../fixtures/database';
import SessionService from '../../src/services/SessionService';
import { createUser, createUnverifiedUser } from '../fixtures/users';

beforeAll(async () => connect());
beforeEach(async () => clear());
afterAll(async () => disconnect());

const user = {
  email: 'user2@test.com',
  name: 'User2',
  password: 'test123456',
  verified: true,
};

const user2 = {
  email: 'user2@test.com',
  name: 'User2',
  password: 'test123456',
  verified: false,
};

describe('User Service', () => {
  test('Should log user in', async () => {
    await createUser();
    const loggedUser = await SessionService.login({
      email: 'user1@test.com',
      password: 'test123456',
    });

    expect(loggedUser.user).toBe('User1');
  });

  test('Should log user in', async () => {
    await createUser();
    const loggedUser = await SessionService.login({
      email: 'user1@test.com',
      password: 'test123456',
    });

    expect(loggedUser.access).toBeTruthy();
    expect(loggedUser.refresh).toBeTruthy();
  });

  test('Should throw an error if user not found', async () => {
    try {
      await SessionService.login(user);
    } catch (err) {
      expect(err.message).toBe('User not found');
      expect(err.statusCode).toBe(404);
    }
  });

  test('Should throw an error if password in invalid', async () => {
    try {
      await createUser();
      await SessionService.login({
        email: 'user1@test.com',
        password: 'wrong-password',
      });
    } catch (err) {
      expect(err.message).toBe('Invalid password');
      expect(err.statusCode).toBe(422);
    }
  });

  test('Should log user out', async () => {
    const createdUser = await createUser();
    await SessionService.login({
      email: 'user1@test.com',
      password: 'test123456',
    });

    const loggedUser = await SessionService.getUserById(createdUser._id);
    expect(loggedUser.token).toBeTruthy();

    await SessionService.logout({ id: createdUser._id });
    const foundUser = await SessionService.getUserById(createdUser._id);
    expect(foundUser.token).toBeFalsy();
  });

  test('Should throw an error if user is not found when logging out', async () => {
    try {
      await SessionService.logout({ id: '5e9a9f3e4c2f8d0f4c4b7f3f' });
    } catch (err) {
      expect(err.message).toBe('User not found');
      expect(err.statusCode).toBe(404);
    }
  });

  test('Should throw an error if user is not verified', async () => {
    try {
      await createUnverifiedUser();
      await SessionService.login({
        email: user2.email,
        password: user2.password,
      });
    } catch (err) {
      expect(err.message).toBe('User not verified');
      expect(err.statusCode).toBe(400);
    }
  })
});
