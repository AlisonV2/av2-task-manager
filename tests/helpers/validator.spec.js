import UserValidator from '../../src/helpers/UserValidator';

describe('UserValidator', () => {
  test('Email validation should fail', async () => {
    try {
      UserValidator.validateEmail('wrong-email');
    } catch (err) {
      expect(err.message).toBe('Invalid email');
      expect(err.statusCode).toBe(409);
    }
  });
});
