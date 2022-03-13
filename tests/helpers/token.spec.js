import TokenValidator from '../../src/helpers/TokenValidator';

describe('TokenValidator', () => {
  test('Task validation should fail', async () => {
    try {
      TokenValidator.isUserAuthenticated();
    } catch (err) {
      expect(err.message).toBe('Not authenticated');
      expect(err.statusCode).toBe(401);
    }
  });
});