import User from '../models/User';

class UserRepository {
  static async getUser(query) {
    return User.findOne({ ...query });
  }

  static async createUser(user) {
    const newUser = new User({...user});
    return newUser.save();
  }

  static async updateUser(user) {
    const updatedUser = await this.getUser({ _id: user.id });
    Object.keys(user).forEach((key) => {
      updatedUser[key] = user[key];
    });
    return updatedUser.save();
  }
}

export default UserRepository;