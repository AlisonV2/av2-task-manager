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

const createAdmin = async () => {
  const hashed = await SecurityService.hashPassword('test123456');
  const newUser = new User({
    email: 'admin1@test.com',
    name: 'Admin1',
    password: hashed,
    verified: true,
    role: 'admin',
  });
  return newUser.save();
};

const createUnverifiedUser = async () => {
  const hashed = await SecurityService.hashPassword('test123456');

  const newUser = new User({
    email: 'user2@test.com',
    name: 'User2',
    password: hashed,
    verified: false,
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

const createAdminToken = async () => {
  const user = await createAdmin();
  const token = SecurityService.generateAccessToken({
    ...user,
    id: user._id.toString(),
  });

  return { user, token };
};

const deleteUser = async (id) => {
  return User.findByIdAndDelete(id);
};

const createUserToken = async () => {
  const user = await createUser();
  const token = SecurityService.generateUserToken({
    email: user.email,
    id: user._id.toString(),
  });

  const newToken = new Token({
    user: user._id.toString(),
    token,
    email: user.email,
  });

  return newToken.save();
};

const createLoggedUser = async () => {
  const user = await createUser();
  const refreshToken = SecurityService.generateRefreshToken({
    ...user,
    id: user._id.toString(),
  });
  const accessToken = SecurityService.generateAccessToken({
    ...user,
    id: user._id.toString(),
  });

  user.token = refreshToken;
  const updatedUser = await user.save();

  return { updatedUser, accessToken };
};

const createLoggedAdmin = async () => {
  const user = await createAdmin();
  const accessToken = SecurityService.generateAccessToken({
    ...user,
    id: user._id.toString(),
  });

  const refreshToken = SecurityService.generateRefreshToken({
    ...user,
    id: user._id.toString(),
  })

  user.token = refreshToken;
  const updatedUser = await user.save();

  return { updatedUser, accessToken };
};

export {
  createUser,
  createAccessToken,
  deleteUser,
  createUserToken,
  createUnverifiedUser,
  createAdmin,
  createAdminToken,
  createLoggedUser,
  createLoggedAdmin
};
