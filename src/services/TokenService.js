import UserRepository from '../repositories/UserRepository';
import SecurityService from './SecurityService';
import DataValidator from '../helpers/DataValidator';
import { NotFoundError } from '../helpers/ErrorGenerator';

export default class TokenService {
  static async refreshToken(refresh) {
    try {
      const user = await UserRepository.getUser({ token: refresh });
      DataValidator.isUserAuthenticated(user);

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

      await UserRepository.verifyUser(user._id);
      await SecurityService.deleteToken(token);

      return 'Email verified';
    } catch (err) {
      throw new NotFoundError('Invalid link');
    }
  }
}
