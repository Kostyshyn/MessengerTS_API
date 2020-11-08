import protectedRoute from '@middlewares/protected';
import uploadFile from '@middlewares/upload';
import AuthController from '@controllers/Auth';
import UserController from '@controllers/User';
import UploadController from '@controllers/Upload';

import { validate } from '@root/validators';

export default [
  {
    route: '/api',
    children: [
      {
        route: '/login',
        method: 'post',
        middleware: validate('login'),
        controller: AuthController.login
      },
      {
        route: '/register',
        method: 'post',
        middleware: validate('register'),
        controller: AuthController.register
      },
      {
        route: '/confirm',
        controller: AuthController.confirm
      },
      {
        route: '/resend-confirm',
        middleware: [protectedRoute],
        controller: AuthController.resendConfirm
      },
      {
        route: '/reset-password',
        method: 'post',
        middleware: validate('resetPassword'),
        controller: AuthController.resetPassword
      },
      {
        route: '/change-password',
        method: 'post',
        middleware: validate('changePassword'),
        controller: AuthController.changePassword
      },
      {
        route: '/user',
        middleware: [protectedRoute],
        controller: UserController.fetchUser,
        children: [
          {
            route: '/info',
            method: 'put',
            middleware: validate('updateInfo'),
            controller: UserController.updateUserInfo
          },
          {
            route: '/image',
            method: 'post',
            middleware: [
              uploadFile,
              validate('image')
            ],
            controller: UploadController.uploadProfileImage
          },
          {
            route: '/contacts',
            controller: UserController.getUserContacts
          }
        ]
      },
      {
        route: '/users',
        middleware: [protectedRoute],
        controller: UserController.getUsers,
        children: [
          {
            route: '/:id',
            controller: UserController.getUserById,
            children: [
              {
                route: '/images',
                controller: UserController.getUserImages,
              }
            ]
          }
        ]
      }
    ]
  }
];
