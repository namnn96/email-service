export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  sender: {
    email: 'abcdemo.corp@gmail.com',
    name: 'ABC Corp Team'
  },
  sendGrid: {
    token: process.env.SENDGRID_TOKEN,
    url: 'https://api.sendgrid.com/v3/mail/send'
  },
  mailGun: {
    apiKey: process.env.MAILGUN_API_KEY
  }
});
