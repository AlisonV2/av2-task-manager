import User from '../models/User';
import SecurityService from './SecurityService';
import EmailService from './EmailService';
import UserRepository from '../repositories/UserRepository';

class UserService {
  static formatUser(user) {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
  static async getUserByEmail(email) {
    return User.findOne({ email: email });
  }
  static async createUser(user) {
    const existingUser = await UserRepository.getUser({ email: user.email });

    if (existingUser) {
      const error = new Error('User already exists');
      error.statusCode = 400;
      throw error;
    }

    // Add data validation
    if (!user.name || !user.email || !user.password) {
      const error = new Error('Missing required fields');
      error.statusCode = 400;
      throw error;
    }

    const hashed = await SecurityService.hashPassword(user.password);
    const newUser = await UserRepository.createUser({
      name: user.name,
      email: user.email,
      password: hashed,
    });

    return this.formatUser(newUser);
  }

  static async register(user) {
    try {
      const newUser = await this.createUser(user);
      const createdToken = await SecurityService.createToken(newUser);
      return await EmailService.sendMail(createdToken.token, newUser.email);
    } catch (err) {
      const error = new Error('Error creating user');
      error.statusCode = 400;
      throw error;
    }
  }

  static async verifyUser(user) {
    const foundUser = await UserRepository.getUser({ email: user.email });

    if (!foundUser) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    if (foundUser.verified === false) {
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

    return this.formatUser(foundUser);
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
      await this.getUserById(user.id);
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

  static async getUserById(id) {
    const user = await UserRepository.getUser({ _id: id });
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  static async refreshToken(refresh) {
    try {
      const user = await User.findOne({ token: refresh });

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

      const verifiedUser = { 
        ...user,
        verified: true,
      };

      await UserRepository.updateUser(verifiedUser);
      await SecurityService.deleteToken(token);

      return 'Email verified';
    } catch (err) {
      const error = new Error(err.message);
      error.statusCode = err.statusCode;
      throw error;
    }
  }
}

export default UserService;
