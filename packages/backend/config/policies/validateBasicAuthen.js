'use strict';

let defaultAccessKey = process.env.BASIC_AUTHORIZATION;

module.exports = (ctx, next) => {
  const { authentication } = ctx.request.header;
  const accessKey = authentication?.split(' ');
  if (!authentication || (accessKey.length && accessKey[1] !== defaultAccessKey)) {
    ctx.status = 401
    return ctx.body = {
      success: false,
      message: 'unauthorized',
    }
  }
  return next();
};
