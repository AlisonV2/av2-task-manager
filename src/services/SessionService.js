import SecurityService from './SecurityService';
import UserRepository from '../repositories/UserRepository';
import QuoteService from './QuoteService';
import DataValidator from '../helpers/DataValidator';
import { NotFoundError, BadRequestError, InvalidDataError } from '../helpers/ErrorGenerator';

export default class SessionService {
  static async getUserById(id) {
    const user = await UserRepository.getUser({ _id: id });
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  static async verifyUser(user) {
    const foundUser = await UserRepository.getUser({ email: user.email });

    if (!foundUser) {
      throw new NotFoundError('User not found');
    }

    if (!foundUser.verified) {
      throw new BadRequestError('User not verified');
    }

    const isPasswordValid = await SecurityService.comparePassword(
      user.password,
      foundUser.password
    );

    if (!isPasswordValid) {
      throw new InvalidDataError('Invalid password');
    }

    return UserRepository.formatUser(foundUser);
  }
  static async login(user) {
    try {
      const foundUser = await this.verifyUser(user);

      const accessToken = SecurityService.generateAccessToken(foundUser);
      const refreshToken = SecurityService.generateRefreshToken(foundUser);

      const userData = {
        ...foundUser,
        token: refreshToken,
      };

      const updatedUser = await UserRepository.updateUser(userData);
      const { content, author } = await QuoteService.getRandomQuote();

      return {
        user: updatedUser.name,
        access: accessToken,
        refresh: refreshToken,
        quote: {
          content: content,
          author: author,
        }
      };
    } catch (err) {
      const error = new Error(err.message);
      error.statusCode = err.statusCode;
      throw error;
    }
  }

  static async logout(user) {
    try {
      const foundUser = await this.getUserById(user.id);

      DataValidator.isUserLoggedIn(foundUser.token);
      
      await UserRepository.updateUser({
        ...user,
        token: null,
      });
      return 'Successfully logged out';
    } catch (err) {
      const error = new Error(err.message);
      error.statusCode = err.statusCode;
      throw error;
    }
  }
}