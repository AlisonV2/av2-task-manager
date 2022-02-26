import User from '../models/User';
import SecurityService from './SecurityService';

class UserService {
  static async createUser(user) {
    // send mail to validate user
    // handle duplicate user case
    try {
      const hashed = await SecurityService.hashPassword(user.password);
      const newUser = new User({
        name: user.name,
        email: user.email,
        password: hashed,
      });

      return newUser.save();
    } catch (err) {
      const error = new Error('Error creating user');
      error.statusCode = 500;
      throw error;
    }
  }

  static async login(user) {
    try {
      const foundUser = await User.findOne({ email: user.email });

      if (!foundUser) {
        const error = new Error('User not found');
        error.statusCode = 404;
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

      const accessToken = SecurityService.generateAccessToken(foundUser);
      const refreshToken = SecurityService.generateRefreshToken(foundUser);

      foundUser.token = refreshToken;
      const updatedUser = await foundUser.save();

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
      foundUser.token = null;
      return await foundUser.save();
    } catch (err) {
      const error = new Error(err.message);
      error.statusCode = err.statusCode;
      throw error;
    }
  }

  static async getUserById(id) {
    try {
      const user = await User.findOne({ _id: id });
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }
      return user;
    } catch (err) {
      const error = new Error(err.message);
      error.statusCode = err.statusCode;
      throw error;
    }
  }

  static async refreshToken(refresh) {
    // To refactor, find by token throw the same error than decoded
    try {

      const user = await User.findOne({ token: refresh });

      if (!user) {
        const error = new Error('Not authenticated');
        error.statusCode = 401;
        throw error;
      }

      const decoded = SecurityService.verifyRefreshToken(refresh);

      if (!decoded) {
        const error = new Error('Not authenticated');
        error.statusCode = 401;
        throw error;
      }

      return SecurityService.generateAccessToken(user);
    } catch (err) {
      const error = new Error(err.message);
      error.statusCode = err.statusCode;
      throw error;
    }
  }
}

export default UserService;
