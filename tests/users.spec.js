import { connect, disconnect } from './fixtures/database';
import UserService from '../src/services/UserService';
import { createUser } from './fixtures/users';

beforeEach(async () => connect());
afterEach(async () => disconnect());

const user = {
  email: 'test123@test.com',
  name: 'Test123',
  password: 'test123456',
};

describe('User Service', () => {
  test('Should create a new User', async () => {
    const createdUser = await UserService.createUser(user);
    expect(createdUser.name).toBe(user.name);
  });

  test('Should return an error if the user already exists', async () => {
    try {
      await createUser();
      await UserService.createUser(user);
    } catch (err) {
      expect(err.message).toBe('User already exists');
      expect(err.statusCode).toBe(400);
    }
  });

  test('Should return an error if the data is invalid', async () => {
    try {
      await createUser();
      await UserService.createUser({
        name: 'EmptyEmail',
      });
    } catch (err) {
      expect(err.message).toBe('Error creating user');
      expect(err.statusCode).toBe(500);
    }
  });

  test('Should log user in', async () => {
    await UserService.createUser(user);
    const loggedUser = await UserService.login({
      email: user.email,
      password: user.password,
    });

    expect(loggedUser.user).toBe(user.name);
  });

  test('Should return tokens', async () => {
    await UserService.createUser(user);
    const loggedUser = await UserService.login({
      email: user.email,
      password: user.password,
    });

    expect(loggedUser.access).toBeTruthy();
    expect(loggedUser.refresh).toBeTruthy();
  });

  test('Should throw an error if user not found', async () => {
    try {
      await UserService.createUser(user);
      await UserService.login({
        email: user.email,
        password: 'wrongpassword',
      });
    } catch (err) {
      expect(err.message).toBe('Invalid password');
      expect(err.statusCode).toBe(401);
    }
  });

  test('Should throw an error if password in invalid', async () => {
    try {
      await UserService.login({
        email: 'notfound@test.com',
        password: 'test123456',
      });
    } catch (err) {
      expect(err.message).toBe('User not found');
      expect(err.statusCode).toBe(404);
    }
  });

  test('Should log user out', async () => {
    const createdUser = await UserService.createUser(user);
    await UserService.login({
      email: user.email,
      password: user.password,
    });

    const loggedUser = await UserService.getUserById(createdUser._id);
    expect(loggedUser.token).toBeTruthy();

    await UserService.logout({ id: createdUser._id });
    const foundUser = await UserService.getUserById(createdUser._id);

    expect(foundUser.token).toBeFalsy();
  });

  test('Should throw an error if user is not found when logging out', async () => {
    try {
      await UserService.logout({ id: '5e9a9f3e4c2f8d0f4c4b7f3f' });
    } catch (err) {
      expect(err.message).toBe('User not found');
      expect(err.statusCode).toBe(404);
    }
  });

  test('Should generate new access token', async () => {
    await UserService.createUser(user);
    const loggedUser = await UserService.login({
      email: user.email,
      password: user.password,
    });

    const refresh = loggedUser.refresh;
    const refreshedToken = await UserService.refreshToken(refresh);
    expect(refreshedToken).toBeTruthy();
  });

  test('Should throw an error if user is not logged in', async () => {
    try {
      await UserService.createUser(user);
      await UserService.refreshToken('test');
    } catch (err) {
      expect(err.message).toBe('Not authenticated');
      expect(err.statusCode).toBe(401);
    }
  });
});
