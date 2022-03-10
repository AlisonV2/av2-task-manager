import { connect, disconnect, clear } from '../fixtures/database';
import UserService from '../../src/services/UserService';
import { createUser, createAdmin } from '../fixtures/users';

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
      expect(err.statusCode).toBe(409);
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
      expect(err.statusCode).toBe(409);
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

  test('Should get all users if admin', async () => {
    await createUser();
    const createdAdmin = await createAdmin();
    const users = await UserService.getAllUsers({ role: 'admin', id: createdAdmin._id });
    expect(users.length).toBe(2);
  })

  test('Should throw an error if user is not admin', async () => {
    try {
      const createdUser = await createUser();
      await UserService.getAllUsers({ role: 'user', id: createdUser._id});
    } catch (err) {
      expect(err.message).toBe('Unauthorized');
      expect(err.statusCode).toBe(403);
    }
  });

  test('Should throw an error if no user is found (admin view)', async () => {
    try {
      await UserService.getAllUsers({ role: 'admin'});
    } catch (err) {
      expect(err.message).toBe('No users found');
      expect(err.statusCode).toBe(404);
    }
  });

  test('Should throw an error if deleting user fails', async () => {
    try {
      await UserService.deleteUser(user);
    } catch (err) {
      expect(err.message).toBe('Error deleting user');
      expect(err.statusCode).toBe(400);
    }
  })

  test('Should return an error if the old_password is missing', async () => {
    try {
      const createdUser = await createUser();
      await UserService.updateUser(
        { id: createdUser._id },
        {
          password: 'user-again123456',
        }
      );
    } catch (err) {
      expect(err.message).toBe('Missing old password');
      expect(err.statusCode).toBe(409);
    }
  });

  test('Should return an error if the old password does not match', async () => {
    try {
      const createdUser = await createUser();
      await UserService.updateUser(
        { id: createdUser._id },
        {
          password: 'user-again123456',
          old_password: 'wrong-password',
        }
      );
    } catch (err) {
      expect(err.message).toBe('Invalid password');
      expect(err.statusCode).toBe(409);
    }
  });

  test('Should update user password', async () => {
    const createdUser = await createUser();
    const updatedUser = await UserService.updateUser(
      { id: createdUser._id },
      {
        name: 'UpdatedUser',
        password: 'user-again123456',
        old_password: 'test123456',
      }
    );

    expect(updatedUser.name).toBe('UpdatedUser');
  });
});
