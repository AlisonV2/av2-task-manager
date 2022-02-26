import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Token from '../models/Token';

dotenv.config();

class SecurityService {
  static async hashPassword(password) {
    return bcrypt.hash(password, 12);
  }

  static comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  static generateAccessToken(user) {
    return jwt.sign(
      {
        id: user._id.toString(),
        role: user.role,
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: '1h' }
    );
  }

  static generateRefreshToken(user) {
    return jwt.sign(
      {
        id: user._id.toString(),
        role: user.role,
      },
      process.env.REFRESH_TOKEN
    );
  }

  static generateUserToken(user) {
    return jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
      },
      process.env.USER_TOKEN
    );
  }

  static verifyAccessToken(token) {
    return jwt.verify(token, process.env.ACCESS_TOKEN);
  }

  static verifyRefreshToken(token) {
    const refresh = jwt.verify(token, process.env.REFRESH_TOKEN);
    if (!refresh) {
      const error = new Error('Invalid refresh token');
      error.statusCode = 401;
      throw error;
    }
    return refresh;
  }

  static verifyUserToken(tokenObject, codedToken) {
    const userToken = jwt.verify(codedToken, process.env.USER_TOKEN);
    if (tokenObject.email !== userToken.email || tokenObject.user !== userToken.id ) {
      const error = new Error('Invalid link');
      error.statusCode = 401;
      throw error;
    }
    return userToken;
  }

  static async createToken(user) {
    const token = new Token({
      user: user._id.toString(),
      token: this.generateUserToken(user),
      email: user.email
    });

    return token.save();
  }

  static async getToken(token) {
    const tokenObject = await Token.findOne({ token });
    if (!tokenObject) {
      const error = new Error('Invalid link');
      error.statusCode = 404;
      throw error;
    }
    return tokenObject;
  }

  static async deleteToken(token) {
    return Token.deleteOne({ token });
  }
}

export default SecurityService;
