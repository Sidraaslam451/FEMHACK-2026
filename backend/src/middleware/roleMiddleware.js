const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      const err = new Error('Not authorized for this action');
      err.statusCode = 403;
      return next(err);
    }
    next();
  };
};

export default authorize;