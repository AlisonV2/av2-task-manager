import SecurityService from '../services/SecurityService';

const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    const token = header.split(' ')[1];

    if (!token) {
      const error = new Error('Not authorized');
      error.statusCode = 401;
      throw error;
    }

    const decoded = SecurityService.verifyAccessToken(token);

    if (!decoded) {
      const error = new Error('Not authenticated');
      error.statusCode = 401;
      throw error;
    }

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default auth;
