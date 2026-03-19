module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('NODE_PORT', 7000),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', 'jwt_secret'),
    },
  },
	cron :{
    enabled: true
  },
});
