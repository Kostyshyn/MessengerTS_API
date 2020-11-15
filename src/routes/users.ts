import UserController from '@controllers/User';
import UploadController from '@controllers/Upload';
import { validate } from '@root/validators';
import { protectedRoute, selfRoute } from '@middlewares/protected';
import uploadFile from '@middlewares/upload';

export default {
  route: '/users',
  middleware: [protectedRoute],
  controller: UserController.getUsers,
  children: [
    {
      route: '/self',
      controller: UserController.fetchUser
    },
    {
      route: '/:id',
      controller: UserController.getUserById,
      children: [
        {
          method: 'put',
          middleware: [selfRoute, validate('updateInfo')],
          controller: UserController.updateUserInfo
        },
        {
          route: '/contacts',
          middleware: [selfRoute],
          controller: UserController.getUserContacts
        },
        {
          route: '/images',
          controller: UserController.getUserImages,
          children: [
            {
              method: 'post',
              middleware: [
                selfRoute,
                uploadFile,
                validate('image')
              ],
              controller: UploadController.uploadProfileImage,
            }
          ]
        }
      ]
    }
  ]
}
