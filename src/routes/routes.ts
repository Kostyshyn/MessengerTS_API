import protectedRoute from '@middlewares/protected';
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
        controller: UserController.fetchUser
      },
      {
        route: '/user',
        method: 'put',
        middleware: [protectedRoute],
        controller: UserController.updateUser
      },
      {
        route: '/users',
        middleware: [protectedRoute],
        controller: UserController.getUsers,
        children: [
          {
            route: '/:url',
            controller: UserController.getUserByUrl
          }
        ]
      },
      {
        route: '/upload/:type',
        method: 'post',
        middleware: [protectedRoute],
        controller: UploadController.uploadFile
      },
    ]
  }
];

