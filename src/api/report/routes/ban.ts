module.exports = {
  routes: [
    {
      method: "POST",
      path: "/reports/:id/ban/subnigdit",
      handler: "report.banMemberFromSubnigdit",
      config: {
        policies: ["global::is-subnigdit-admin"]
      }
    },
    {
      method: "POST",
      path: "/reports/:id/ban/user",
      handler: "report.banMemberFromNigdit",
      config: {
        policies: ["global::is-nigdit-admin"],
      },
    },
    {
      method: "GET",
      path: "/reports/tonigdit",
      handler: "report.findToNigdit",
      config: {
        policies: ["global::is-nigdit-admin"],
      },
    },
    {
      method: "DELETE",
      path: "/reports/:id/withcontent",
      handler: "report.deleteWithContent",
      config: {
        policies: ["global::is-nigdit-admin-or-subnigdit-admin"],
      },
    }
  ],
};
