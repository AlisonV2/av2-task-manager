import { connect, disconnect, clear } from '../fixtures/database';
import UserService from '../../src/services/UserService';
import { createUser } from '../fixtures/users';

beforeAll(async () => connect());
beforeEach(async () => clear());
afterAll(async () => disconnect());

const user = {
  email: 'user2@test.com',
  name: 'User2',
  password: 'test123456',
  verified: true,
};

describe('User Service', () => {
  test('Should create a new User', async () => {
    const createdUser = await UserService.createUser(user);
    expect(createdUser.name).toBe(user.name);
  });

  test('Should return an error if the user already exist', async () => {
    try {
        await UserService.createUser(user);
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
      expect(err.message).toBe('Missing required fields');
      expect(err.statusCode).toBe(400);
    }
  });
});
