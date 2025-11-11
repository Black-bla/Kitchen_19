module.exports = (roles = []) => (req, res, next) => {
  // TODO: check user role
  next();
};
