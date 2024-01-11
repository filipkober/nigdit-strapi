module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1338),
  url: env('URL', 'http://localhost:'+env.int('PORT', 1338)),
  app: {
    keys: env.array('APP_KEYS'),
  },
});
