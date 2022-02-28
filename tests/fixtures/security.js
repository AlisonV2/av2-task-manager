import Token from '../../src/models/Token';
import SecurityService from '../../src/services/SecurityService';

const createToken = async () => {
  const user = {
    id: '5f0b8b9f9d7d3b3d3c7f2f0f',
    name: 'User1',
    email: 'user1@test.com',
    role: 'user',
  };
  
  const token = SecurityService.generateUserToken(user);

  const newToken = new Token({
    user: user.name,
    token: token,
    email: user.email,
  });

  return newToken.save();
};

export { createToken };