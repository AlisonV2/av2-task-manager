import User from '../models/User';
import SecurityService from './SecurityService';
import EmailService from './EmailService';

class UserService {
  static async getUserByEmail(email) {
    return User.findOne({ email: email });
  }
  static async createUser(user) {
    try {
      const existingUser = await this.getUserByEmail(user.email);

      if (existingUser) {
        const error = new Error('User already exists');
        error.statusCode = 400;
        throw error;
      }

      const hashed = await SecurityService.hashPassword(user.password);

      return await new User({
        name: user.name,
        email: user.email,
        password: hashed,
      }).save();
    } catch (err) {
      const error = new Error('Error creating user');
      error.statusCode = err.statusCode ?? 500;
      throw error;
    }
  }

  static async register(user) {
    try {
      const newUser = await this.createUser(user);
      const createdToken = await SecurityService.createToken(newUser);
      return await EmailService.sendMail(createdToken.token, newUser.email);
    } catch (err) {
      const error = new Error('Error creating user');
      error.statusCode = 500;
      throw error;
    }
  }
  static async login(user) {
    try {
      const foundUser = await this.getUserByEmail(user.email);

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
      error.statusCode = err.statusCode ?? 500;
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
      console.log(decoded);

      const user = await User.findOne({
        _id: decoded.id,
        email: decoded.email,
      });

      if (!user) {
        const error = new Error('No user found');
        error.statusCode = 404;
        throw error;
      }

      user.verified = true;
      await user.save();
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
