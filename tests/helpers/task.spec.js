import TaskValidator from '../../src/helpers/TaskValidator';

describe('TaskValidator', () => {
  test('Task validation should fail', async () => {
    try {
      TaskValidator.validateTaskFields({ 
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
      TaskValidator.validateUpdateFields({ 
        title: 'Whatever',
        status: 'in-progress',
        id: '123456'
      });
    } catch (err) {
      expect(err.message).toBe('Invalid updates');
      expect(err.statusCode).toBe(422);
    }
  });

  test('Completing task should fail', async () => {
    try {
      TaskValidator.validateCompleteTask({ 
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
      TaskValidator.validateFilters(user, filters);
    } catch (err) {
      expect(err.message).toBe('Forbidden filters');
      expect(err.statusCode).toBe(403);
    }
  });

  test('Should throw an error if data is empty', async () => {
    try {
      TaskValidator.isEmptyData([]);
    } catch (err) {
      expect(err.message).toBe('No tasks found');
      expect(err.statusCode).toBe(404);
    }
  });
});
