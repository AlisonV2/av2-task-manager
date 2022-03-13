import UserValidator from '../../src/helpers/UserValidator';
import { createUser } from '../fixtures/users';
import { connect, disconnect, clear } from '../fixtures/database';

beforeAll(async () => connect());
beforeEach(async () => clear());
afterAll(async () => disconnect());

describe('UserValidator', () => {
  test('Email validation should fail', async () => {
    try {
      UserValidator.validateEmail('wrong-email');
    } catch (err) {
      expect(err.message).toBe('Invalid email');
      expect(err.statusCode).toBe(409);
    }
  });

  test('User fields validation should fail', async () => {
    try {
      UserValidator.validateUserFields({
        name: 'Whatever',
        password: '123456',
      });
    } catch (err) {
      expect(err.message).toBe('Missing required fields');
      expect(err.statusCode).toBe(409);
    }
  });

  test('User already exist', async () => {
    const user = await createUser();
    try {
      UserValidator.validateUserFields(user);
    } catch (err) {
      expect(err.message).toBe('User already exists');
      expect(err.statusCode).toBe(400);
    }
  });

  test('Should not update password if field is missing', async () => {
    try {
      UserValidator.validatePasswordFields({ password: '123456'});
    } catch (err) {
      expect(err.message).toBe('Missing old password');
      expect(err.statusCode).toBe(409);
    }
  });

  test('Should not allow email to be updated', async () => {
    try {
      UserValidator.validateUpdateFields({ password: '123456', email: 'test@test.com'});
    } catch (err) {
      expect(err.message).toBe('Invalid updates');
      expect(err.statusCode).toBe(409);
    }
  });

  test('Should throw an error if role is user', async () => {
    try {
      UserValidator.validateAdminRole('user');
    } catch (err) {
      expect(err.message).toBe('Unauthorized');
      expect(err.statusCode).toBe(403);
    }
  });

  test('Should throw an error if data is empty', async () => {
    try {
      UserValidator.isEmptyData([]);
    } catch (err) {
      expect(err.message).toBe('No users found');
      expect(err.statusCode).toBe(404);
    }
  });
});
