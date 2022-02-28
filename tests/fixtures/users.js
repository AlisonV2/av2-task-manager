import User from '../../src/models/User';
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
  const token = await SecurityService.generateAccessToken({
    ...user,
    id: user._id.toString(),
  });

  return { user, token };
};

export { createUser, createAccessToken };
