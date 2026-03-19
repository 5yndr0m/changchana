module.exports = strapi => {
  return {
    initialize() {
      strapi.app.use(async (ctx, next) => {
        // Bypass authentication for wallet-admin routes
        if (ctx.request.url.startsWith('/wallet-admin/')) {
          ctx.state.user = ctx.state.user || null;
          ctx.state.isAuthenticated = false;
        }
        await next();
      });
    },
  };
};
