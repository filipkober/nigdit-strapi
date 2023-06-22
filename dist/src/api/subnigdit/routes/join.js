module.exports = {
    routes: [
        {
            method: "POST",
            path: "/subnigdits/join/:id",
            handler: "subnigdit.joinSubnigdit",
        },
        {
            method: "GET",
            path: "/subnigdits/check/:id",
            handler: "subnigdit.checkSubscription",
        },
    ]
};
