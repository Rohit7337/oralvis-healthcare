const jwt = require('jsonwebtoken');

module.exports = (roles = []) => {
  const required = Array.isArray(roles) ? roles : [roles];
  return (req, res, next) => {
    const header = req.headers['authorization'] || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Missing token' });

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload;
      if (required.length && !required.includes(payload.role)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      next();
    } catch (e) {
      return res.status(401).json({ error: 'Invalid/expired token' });
    }
  };
};
