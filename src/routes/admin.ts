import AdminController from '@controllers/Admin';
import { protectedRoute, adminRoute } from '@middlewares/protected';

export default {
  route: '/admin',
  middleware: [protectedRoute, adminRoute],
  controller: AdminController.getAdminData,
  children: []
}
