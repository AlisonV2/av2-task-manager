import User from '../../src/models/User';

const createUser = async () => {
  const newUser = new User({
    email: 'test123@test.com',
    name: 'Test123',
    password: 'test123456',
  });

  return newUser.save();
};

export { createUser };