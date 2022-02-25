import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

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
      process.env.REFRESH_TOKEN,
    );
  }

  static verifyAccessToken(token) {
    return jwt.verify(token, process.env.ACCESS_TOKEN);
  }

  static verifyRefreshToken(token) {
    return jwt.verify(token, process.env.REFRESH_TOKEN);
  }
}

export default SecurityService;
