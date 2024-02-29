module.exports = ({ env }) => ({
    email: {
        config: {
            provider: 'sendgrid',
            providerOptions: {
                apiKey: env("SENDGRID_API_KEY", "nokey"),
            },
            settings: {
                defaultFrom: 'noreply@nigdit.men',
                defaultReplyTo: 'noreply@nigdit.men',
            },
        },
    },
});
