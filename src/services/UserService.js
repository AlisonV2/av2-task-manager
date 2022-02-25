import User from '../models/User';

class UserService {
  static async createUser(user) {
    try {
      const newUser = new User({
        name: user.name,
        email: user.email,
        password: user.password,
      });

      return newUser.save();
    } catch (err) {
      const error = new Error('Error creating user');
      error.statusCode = 500;
      throw error;
    }
  }
}

export default UserService;
