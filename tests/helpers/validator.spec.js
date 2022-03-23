import DataValidator from '../../src/helpers/DataValidator';
import { createUser } from '../fixtures/users';
import { connect, disconnect, clear } from '../fixtures/database';

beforeAll(async () => connect());
beforeEach(async () => clear());
afterAll(async () => disconnect());

describe('DataValidator', () => {
  test('Token validation should fail', async () => {
    try {
      DataValidator.isUserAuthenticated();
    } catch (err) {
      expect(err.message).toBe('Not authenticated');
      expect(err.statusCode).toBe(401);
    }
  });
  test('Task validation should fail', async () => {
    try {
      DataValidator.validateTaskFields({ 
        title: 'Whatever',
        status: 'in-progress'
      });
    } catch (err) {
      expect(err.message).toBe('Missing required fields');
      expect(err.statusCode).toBe(422);
    }
  });

  test('Update fields validation should fail', async () => {
    try {
      DataValidator.validateUpdateFields({ 
        title: 'Whatever',
        status: 'in-progress',
        id: '123456'
      }, 'task');
    } catch (err) {
      expect(err.message).toBe('Invalid updates');
      expect(err.statusCode).toBe(422);
    }
  });

  test('Completing task should fail', async () => {
    try {
      DataValidator.validateCompleteTask({ 
        status: 'completed'
      });
    } catch (err) {
      expect(err.message).toBe('Logging time is required to complete a task');
      expect(err.statusCode).toBe(422);
    }
  });

  test('Filters validation should fail', async () => {
    const user = {
      role: 'user'
    };

    const filters = {
      status: 'completed',
      sort: 'title:asc',
      user: '123456'
    }

    try {
      DataValidator.validateFilters(user, filters);
    } catch (err) {
      expect(err.message).toBe('Forbidden filters');
      expect(err.statusCode).toBe(403);
    }
  });

  test('Should throw an error if data is empty', async () => {
    try {
      DataValidator.isEmptyData([], 'tasks');
    } catch (err) {
      expect(err.message).toBe('No tasks found');
      expect(err.statusCode).toBe(404);
    }
  });
  test('Email validation should fail', async () => {
    try {
      DataValidator.validateEmail('wrong-email');
    } catch (err) {
      expect(err.message).toBe('Invalid email');
      expect(err.statusCode).toBe(422);
    }
  });

  test('User fields validation should fail', async () => {
    try {
      DataValidator.validateUserFields({
        name: 'Whatever',
        password: '123456',
      });
    } catch (err) {
      expect(err.message).toBe('Missing required fields');
      expect(err.statusCode).toBe(422);
    }
  });

  test('User already exist', async () => {
    const user = await createUser();
    try {
      DataValidator.validateUserFields(user);
    } catch (err) {
      expect(err.message).toBe('User already exists');
      expect(err.statusCode).toBe(400);
    }
  });

  test('Should not update password if field is missing', async () => {
    try {
      DataValidator.validatePasswordFields({ password: '123456'});
    } catch (err) {
      expect(err.message).toBe('Missing old password');
      expect(err.statusCode).toBe(422);
    }
  });

  test('Should not allow email to be updated', async () => {
    try {
      DataValidator.validateUpdateFields({ password: '123456', email: 'test@test.com'}, 'user');
    } catch (err) {
      expect(err.message).toBe('Invalid updates');
      expect(err.statusCode).toBe(422);
    }
  });

  test('Should throw an error if role is user', async () => {
    try {
      DataValidator.validateAdminRole('user');
    } catch (err) {
      expect(err.message).toBe('Unauthorized');
      expect(err.statusCode).toBe(403);
    }
  });

  test('Should throw an error if data is empty', async () => {
    try {
      DataValidator.isEmptyData([], 'users');
    } catch (err) {
      expect(err.message).toBe('No users found');
      expect(err.statusCode).toBe(404);
    }
  });
});