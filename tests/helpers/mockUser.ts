// user mock data
const mockUser = {
  username: "tester",
  email: "tester@nigdit.com",
  password: "Nigdit123",
  confirmed: true,
  blocked: null,
  provider: "local",
};
export default mockUser;

export const randomUser = () => ({
  username: `user_${Math.random().toString(36).substring(7)}`,
  email: `user_${Math.random().toString(36).substring(7)}@nigdit.com`,
  password: "Nigdit123",
  confirmed: true,
  blocked: null,
  provider: "local",
})

export const makeUser = async (admin = false) => {
  const defaultRole = await strapi.query('plugin::users-permissions.role').findOne({});

  const role = defaultRole ? defaultRole.id : null;

  const user = await strapi.plugins['users-permissions'].services.user.add({
      ...randomUser(),
      admin,
      role,
  });

  return user;
}