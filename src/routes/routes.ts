import protectedRoute from '@middlewares/protected';
import uploadFile from '@middlewares/upload';
import AuthController from '@controllers/Auth';
import UserController from '@controllers/User';
import UploadController from '@controllers/Upload';

import { validate } from '@validators/index';

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
              protectedRoute,
              uploadFile
            ],
            controller: UploadController.uploadProfileImage
          }
        ]
      },
      {
        route: '/users',
        middleware: [protectedRoute],
        controller: UserController.getUsers,
        children: [
          // test
          {
            route: '/images',
            controller: UserController.getUserImages
          },
          //
          {
            route: '/:url',
            controller: UserController.getUserByUrl
          }
        ]
      }
    ]
  }
];
