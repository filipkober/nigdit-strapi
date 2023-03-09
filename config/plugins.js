module.exports = ({ env }) => ({
    email: {
      config: {
        provider: 'sendgrid',
        providerOptions: {
          apiKey: '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',
        },
        settings: {
          defaultFrom: 'noreply@nigdit.men',
          defaultReplyTo: 'noreply@nigdit.men',
        },
      },
    }
  });