import { connect, disconnect, clear } from './fixtures/database';
import SecurityService from '../src/services/SecurityService';
import { createToken } from './fixtures/security';

beforeAll(async () => connect());
beforeEach(async () => clear());
afterAll(async () => disconnect());

const user = {
  id: '5f0b8b9f9d7d3b3d3c7f2f0f',
  name: 'User1',
  email: 'user1@test.com',
  role: 'user',
};

describe('Security Service', () => {
  test('Should hash password', async () => {
    const password = 'test123456';
    const hashedPassword = await SecurityService.hashPassword(password);
    expect(hashedPassword).not.toBe(password);
  });

  test('Should compare passwords', async () => {
    const password = 'test123456';
    const hashedPassword = await SecurityService.hashPassword(password);
    const compared = await SecurityService.comparePassword(
      password,
      hashedPassword
    );
    expect(compared).toBe(true);
  });

  test('Should generate access token', () => {
    const token = SecurityService.generateAccessToken(user);
    expect(token).toBeDefined();
  });

  test('Should generate refresh token', () => {
    const token = SecurityService.generateRefreshToken(user);
    expect(token).toBeDefined();
  });

  test('Should generate user token', () => {
    const token = SecurityService.generateUserToken(user);
    expect(token).toBeDefined();
  });

  test('Should verify access token', async () => {
    const token = SecurityService.generateAccessToken(user);
    const verified = SecurityService.verifyAccessToken(token);
    expect(verified).toBeDefined();
  });

  test('Should verify refresh token', async () => {
    const token = SecurityService.generateRefreshToken(user);
    const verified = SecurityService.verifyRefreshToken(token);
    expect(verified).toBeDefined();
  });

  test('Should throw error when invalid access token', () => {
    const token = SecurityService.generateAccessToken(user);
    try {
      SecurityService.verifyAccessToken(token, 'invalid');
    } catch (error) {
      expect(error.message).toBe('jwt malformed');
    }
  });

  test('Should throw error when invalid refresh token', () => {
    const token = SecurityService.generateRefreshToken(user);
    try {
      SecurityService.verifyRefreshToken(token, 'invalid');
    } catch (error) {
      expect(error.message).toBe('jwt malformed');
    }
  });

  test('Should throw error when invalid user token', () => {
    const token = SecurityService.generateUserToken(user);
    try {
      SecurityService.verifyUserToken(token, 'invalid');
    } catch (error) {
      expect(error.message).toBe('jwt malformed');
    }
  });

  test('Should create a new token', async () => {
    const token = await SecurityService.createToken(user);
    expect(token).toBeDefined();
  });

  test('Should get an existing token', async () => {
    const createdToken = await createToken();
    const foundToken = await SecurityService.getToken(createdToken.token);
    expect(foundToken).toBeDefined();
    expect(foundToken.token).toBe(createdToken.token);
    expect(foundToken.email).toBe(createdToken.email);
  })

  test('Should delete an existing token', async () => {
    const createdToken = await createToken();
    const deletedToken = await SecurityService.deleteToken(createdToken.token);
    expect(deletedToken).toBeDefined();
  })

  test('Should throw an error as token has been deleted', async () => {
    const createdToken = await createToken();
    await SecurityService.deleteToken(createdToken.token);
    try {
      await SecurityService.getToken(createdToken.token);
    } catch (error) {
      expect(error.message).toBe('Invalid link');
    }
  })
});
