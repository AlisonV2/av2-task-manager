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
      await UserService.createUser({
        name: 'EmptyEmail',
      });
    } catch (err) {
      expect(err.message).toBe('Missing required fields');
      expect(err.statusCode).toBe(400);
    }
  });

  test('Should update an existing user', async () => {
    const createdUser = await createUser();
    const updatedUser = await UserService.updateUser(
      { id: createdUser._id },
      {
        name: 'UpdatedUser',
      }
    );

    expect(updatedUser.name).toBe('UpdatedUser');
  });

  test('Should return an error if the user does not exist', async () => {
    try {
      await UserService.updateUser('5e8f8b8c8f8b8c8f8b8c8f8', {
        name: 'UpdatedUser',
      });
    } catch (err) {
      expect(err.message).toBe('User not found');
      expect(err.statusCode).toBe(404);
    }
  });

  test('Should return an error if the updated field is not valid', async () => {
    try {
      const createdUser = await createUser();
      await UserService.updateUser(
        { id: createdUser._id },
        {
          id: 'user123456',
        }
      );
    } catch (err) {
      expect(err.message).toBe('Invalid updates');
      expect(err.statusCode).toBe(400);
    }
  });

  test('Should get a user', async () => {
    const createdUser = await createUser();
    const foundUser = await UserService.getUser({ id: createdUser._id });
    expect(foundUser.name).toBe('User1');
  });

  test('Should return an error if the user does not exist', async () => {
    try {
      await UserService.getUser({ id: '5e8f8b8c8f8b8c8f8b8c8f8' });
    } catch (err) {
      expect(err.message).toBe('User not found');
      expect(err.statusCode).toBe(404);
    }
  });

  test('Should delete a user', async () => {
    const createdUser = await createUser();
    const deletedUser = await UserService.deleteUser({ id: createdUser._id });
    expect(deletedUser).toBe('User deleted successfully');
  });
});
