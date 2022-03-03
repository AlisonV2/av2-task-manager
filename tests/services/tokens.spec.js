import { connect, disconnect, clear } from '../fixtures/database';
import UserService from '../../src/services/UserService';
import TokenService from '../../src/services/TokenService';
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

describe('Token Service', () => {
  test('Should generate new access token', async () => {
    await createUser();
    const loggedUser = await UserService.login({
        email: 'user1@test.com',
        password: 'test123456',
    });

    const refresh = loggedUser.refresh;
    const refreshedToken = await TokenService.refreshToken(refresh);
    expect(refreshedToken).toBeTruthy();
  });

  test('Should throw an error if user is not logged in', async () => {
    try {
      await UserService.createUser(user);
      await TokenService.refreshToken('test');
    } catch (err) {
      expect(err.message).toBe('Not authenticated');
      expect(err.statusCode).toBe(401);
    }
  });
});
