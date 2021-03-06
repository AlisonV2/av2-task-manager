import User from '../models/User';
import { NotFoundError } from '../helpers/ErrorGenerator';

class UserRepository {
  static formatUser(user) {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      token: user.token
    };
  }

  static async getUser(query) {
    return User.findOne({ ...query });
  }

  static async createUser(user) {
    const newUser = new User({ ...user });
    return newUser.save();
  }

  static async updateUser(user) {
    const updatedUser = await this.getUser({ _id: user.id });

    if (!updatedUser) {
      throw new NotFoundError('User not found');
    }

    Object.keys(user).forEach((key) => {
      updatedUser[key] = user[key];
    });

    return updatedUser.save();
  }

  static async verifyUser(id) {
    const user = await this.getUser({ _id: id });
    user.verified = true;
    return user.save();
  }

  static async deleteUser(id) {
    const user = await this.getUser({ _id: id });    
    return user.remove();
  }

  static getAllUsers() {
    return User.find();
  }
}

export default UserRepository;
