import Token from '../models/Token';

class TokenRepository {
  static async createToken(user, token) {
    const newToken = new Token({
      user: user.id,
      token: token,
      email: user.email,
    });

    return newToken.save();
  }

  static async getToken(query) {
    return Token.findOne({ ...query });
  }

  static deleteToken(query) {
    return Token.deleteOne({ ...query });
  }
}

export default TokenRepository;