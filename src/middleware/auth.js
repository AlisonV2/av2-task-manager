import SecurityService from '../services/SecurityService';

const auth = async (req, res, next) => {
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
      .json({ message: 'Not authorized' });
  }
};

export default auth;
