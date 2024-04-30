export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1338),
  url: env('URL', 'http://localhost:'+env.int('PORT', 1338)),
  app: {
    keys: env.array('APP_KEYS'),
  },
  // settings: {
  //   parser: {
  //     enabled: true,
  //     multipart: true,
  //     formidable: {
  //       maxFileSize: 250 * 1024 * 1024,
  //     },
  //   },
  // },
});
