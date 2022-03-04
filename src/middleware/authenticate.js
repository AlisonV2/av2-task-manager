import SecurityService from '../services/SecurityService';

const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    const token = header.split(' ')[1];

    const decoded = SecurityService.verifyAccessToken(token);

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (err) {
    res
      .status(401)
      .json('Not authorized');
  }
};

export default authenticate;
