export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  sendGrid: {
    token: process.env.SENDGRID_TOKEN
  },
  mailGun: {
    apiKey: process.env.MAILGUN_API_KEY
  }
});
