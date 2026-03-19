module.exports = ({ env }) => ({
  email: {
    provider: 'nodemailer',
    providerOptions: {
      host: 'smtp.gmail.com',
      port: 465,
      auth: {
        user: 'admin@chongjaroen.com',
        pass: 'zvhjmiafapduhutd',
      },
      // ... any custom nodemailer options
    },
    settings: {
      defaultFrom: 'noreply@chongjaroen.com',
      defaultReplyTo: 'noreply@chongjaroen.com',
    },
  },
});