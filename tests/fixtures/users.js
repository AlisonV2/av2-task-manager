import User from '../../src/models/User';
import Token from '../../src/models/Token';
import SecurityService from '../../src/services/SecurityService';

const createUser = async () => {
  const hashed = await SecurityService.hashPassword('test123456');

  const newUser = new User({
    email: 'user1@test.com',
    name: 'User1',
    password: hashed,
    verified: true,
  });

  return newUser.save();
};

const createAccessToken = async () => {
  const user = await createUser();
  const token = SecurityService.generateAccessToken({
    ...user,
    id: user._id.toString(),
  });

  return { user, token };
};

const deleteUser = async (id) => {
  return User.findByIdAndDelete(id);
}

const createUserToken = async () => {
  const user = await createUser();
  const token = SecurityService.generateUserToken({
    email: user.email,
    id: user._id.toString(),
  });

  const newToken = new Token({
    user: user._id.toString(),
    token,
    email: user.email
  });

  return newToken.save();
}


export { createUser, createAccessToken, deleteUser, createUserToken };
