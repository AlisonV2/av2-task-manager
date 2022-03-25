import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import TokenRepository from '../repositories/TokenRepository';
import { NotFoundError } from '../helpers/ErrorGenerator';

dotenv.config();

export default class SecurityService {
  static async hashPassword(password) {
    return bcrypt.hash(password, 12);
  }

  static comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  static generateAccessToken(user) {
    return jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: '1h' }
    );
  }

  static generateRefreshToken(user) {
    return jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.REFRESH_TOKEN
    );
  }

  static generateUserToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.USER_TOKEN
    );
  }

  static verifyAccessToken(token) {
      return jwt.verify(token, process.env.ACCESS_TOKEN);
  }

  static verifyRefreshToken(token) {
    return jwt.verify(token, process.env.REFRESH_TOKEN);
  }

  static verifyUserToken(tokenObject, codedToken) {
    const userToken = jwt.verify(codedToken, process.env.USER_TOKEN);
    if (
      tokenObject.email !== userToken.email ||
      tokenObject.user !== userToken.id
    ) {
      throw new NotFoundError('Invalid link')
    }
    return userToken;
  }

  static async createToken(user) {
    const token = this.generateUserToken(user);
    return TokenRepository.createToken(user, token);
  }

  static async getToken(token) {
    const foundToken = await TokenRepository.getToken({ token })
    if (!foundToken) {
      throw new NotFoundError('Invalid link')
    }
    return foundToken;
  }

  static async deleteToken(token) {
    await this.getToken(token)
    return TokenRepository.deleteToken({ token });
  }
}