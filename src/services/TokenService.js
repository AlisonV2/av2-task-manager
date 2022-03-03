import TokenRepository from '../repositories/TokenRepository';
import UserRepository from '../repositories/UserRepository';
import SecurityService from './SecurityService';

class TokenService {
  static async getToken(token) {
    const foundToken = await TokenRepository.getToken({ token })
    if (!foundToken) {
      const error = new Error('Invalid link');
      error.statusCode = 404;
      throw error;
    }
    return foundToken;
  }

  static async refreshToken(refresh) {
    try {
      const user = await UserRepository.getUser({ token: refresh });

      if (!user) {
        const error = new Error('Not authenticated');
        error.statusCode = 401;
        throw error;
      }

      SecurityService.verifyRefreshToken(refresh);

      return SecurityService.generateAccessToken(user);
    } catch (err) {
      const error = new Error(err.message);
      error.statusCode = err.statusCode;
      throw error;
    }
  }

  static async verifyEmail(token) {
    try {
      const tokenObject = await SecurityService.getToken(token);
      const decoded = SecurityService.verifyUserToken(tokenObject, token);

      const user = await UserRepository.getUser({
        _id: decoded.id,
        email: decoded.email,
      });

      if (!user) {
        const error = new Error('No user found');
        error.statusCode = 404;
        throw error;
      }

      await UserRepository.verifyUser(user._id);
      await SecurityService.deleteToken(token);

      return 'Email verified';
    } catch (err) {
      const error = new Error(err.message);
      error.statusCode = err.statusCode;
      throw error;
    }
  }
}

export default TokenService;
