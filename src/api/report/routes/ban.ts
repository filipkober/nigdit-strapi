module.exports = {
    routes: [
        {
            method: 'POST',
            path: "/reports/:id/ban/subnigdit",
            handler: 'report.banMemberFromSubnigdit',
        }
    ]
}