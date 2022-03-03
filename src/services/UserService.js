import SecurityService from './SecurityService';
import EmailService from './EmailService';
import UserRepository from '../repositories/UserRepository';

class UserService {
  static async createUser(user) {
    const existingUser = await UserRepository.getUser({ email: user.email });

    if (existingUser) {
      const error = new Error('User already exists');
      error.statusCode = 400;
      throw error;
    }

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

    return UserRepository.formatUser(newUser);
  }

  static async register(user) {
    try {
      const newUser = await this.createUser(user);
      const createdToken = await SecurityService.createToken(newUser);
      return await EmailService.sendMail(createdToken.token, newUser.email);
    } catch (err) {
      const error = new Error(err.message);
      error.statusCode = err.statusCode;
      throw error;
    }
  }
}

export default UserService;
