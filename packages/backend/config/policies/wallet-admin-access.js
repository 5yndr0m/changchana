module.exports = async (ctx, next) => {
  // Always allow access to wallet-admin routes
  return await next();
};
