export default {
  routes: [
    {
     method: 'PUT',
     path: '/users/me/profile-picture',
     handler: 'user.changeProfilePicture',
    },
    {
      method: 'PUT',
      path: '/users/me',
      handler: 'user.updateMe',
    }
  ],
};
