import SecurityService from './SecurityService';
import UserRepository from '../repositories/UserRepository';

class SessionService {
  static async getUserById(id) {
    const user = await UserRepository.getUser({ _id: id });
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }
  static async verifyUser(user) {
    const foundUser = await UserRepository.getUser({ email: user.email });

    if (!foundUser) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    if (!foundUser.verified) {
      const error = new Error('User not verified');
      error.statusCode = 400;
      throw error;
    }

    const isPasswordValid = await SecurityService.comparePassword(
      user.password,
      foundUser.password
    );

    if (!isPasswordValid) {
      const error = new Error('Invalid password');
      error.statusCode = 401;
      throw error;
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

      return {
        user: updatedUser.name,
        access: accessToken,
        refresh: refreshToken,
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

      if (!foundUser.token) {
        const error = new Error('User not logged in');
        error.statusCode = 401;
        throw error;
      }
      
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

export default SessionService;
