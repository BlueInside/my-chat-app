function checkRole(requiredRole) {
  return function (req, res, next) {
    if (req.user.role !== requiredRole) {
      return res
        .status(403)
        .json({ message: 'Access forbidden: Insufficient permissions.' });
    }
    next();
  };
}

module.exports = { checkRole };
