export default ({ env }) => ({
    email: {
      config: {
        provider: 'sendgrid',
        providerOptions: {
          apiKey: env("SENDGRID_API_KEY", "SG.nokey"),
        },
        settings: {
          defaultFrom: 'noreply@nigdit.men',
          defaultReplyTo: 'noreply@nigdit.men',
        },
      },
    },
    upload: {
      config: {
        sizeLimit: 250 * 1024 * 1024
      }
    }
  });