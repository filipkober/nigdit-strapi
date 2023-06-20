"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
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
