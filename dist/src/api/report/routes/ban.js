module.exports = {
    routes: [
        {
            method: "POST",
            path: "/reports/:id/ban/subnigdit",
            handler: "report.banMemberFromSubnigdit",
        },
        {
            method: "POST",
            path: "/reports/:id/ban/user",
            handler: "report.banMemberFromNigdit",
            config: {
                policies: ["global::isNigditAdmin"],
            },
        },
    ],
};
