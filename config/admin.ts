import * as crypto from 'crypto';

module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transferToken: {
    salt: crypto.randomBytes(16).toString('base64')
  }
});
