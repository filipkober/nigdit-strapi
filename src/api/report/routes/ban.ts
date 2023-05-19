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
    {
      method: "GET",
      path: "/reports/tonigdit",
      handler: "report.findToNigdit",
      config: {
        policies: ["global::isNigditAdmin"],
      },
    }
  ],
};
