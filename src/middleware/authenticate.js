import SecurityService from '../services/SecurityService';
import UserService from '../services/UserService';

const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    const token = header.split(' ')[1];

    const decoded = SecurityService.verifyAccessToken(token);
    const user = await UserService.getUser({ id: decoded.id });

    if (!user.token) {
      throw new Error();
    }

    req.user = user;

    next();
  } catch (err) {
    res.status(401).json('Not authorized');
  }
};

export default authenticate;
