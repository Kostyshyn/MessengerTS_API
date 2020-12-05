import AdminController from '@controllers/Admin';
import OriginController from '@controllers/Origin';
import { protectedRoute, adminRoute } from '@middlewares/protected';
import { validate } from '@root/validators';

export default {
  route: '/admin',
  middleware: [protectedRoute, adminRoute],
  controller: AdminController.getAdminData,
  children: [
    {
      route: '/users',
      controller: AdminController.getUsers
    },
    {
      route: '/origins',
      controller: OriginController.getOrigins,
      children: [
        {
          method: 'post',
          middleware: validate('originData'),
          controller: OriginController.createOrigin,
        },
        {
          route: '/:id',
          controller: OriginController.getOrigin,
          children: [
            {
              method: 'put',
              middleware: validate('originData'),
              controller: OriginController.updateOrigin,
            },
            {
              method: 'delete',
              controller: OriginController.deleteOrigin,
            }
          ]
        }
      ]
    }
  ]
}
