import { connect, disconnect, clear } from '../fixtures/database';
import TokenService from '../../src/services/TokenService';
import SessionService from '../../src/services/SessionService';
import { createUser } from '../fixtures/users';
import { createToken } from '../fixtures/security';

beforeAll(async () => connect());
beforeEach(async () => clear());
afterAll(async () => disconnect());

describe('Token Service', () => {
  test('Should generate new access token', async () => {
    await createUser();
    const loggedUser = await SessionService.login({
        email: 'user1@test.com',
        password: 'test123456',
    });

    const refresh = loggedUser.refresh;
    const refreshedToken = await TokenService.refreshToken(refresh);
    expect(refreshedToken).toBeTruthy();
  });

  test('Should throw an error if user is not logged in', async () => {
    try {
      await createUser();
      await TokenService.refreshToken('test');
    } catch (err) {
      expect(err.message).toBe('Not authenticated');
      expect(err.statusCode).toBe(401);
    }
  });

  test('Should throw an error when no user found', async () => {
    try {
      const { token } = await createToken();
      await TokenService.verifyEmail(token);
    } catch (err) {
      expect(err.message).toBe('Invalid link');
      expect(err.statusCode).toBe(404);
    }
  })
});
