import AuthController from '@controllers/Auth';
import { validate } from '@root/validators';
import { protectedRoute } from '@middlewares/protected';

export default {
  route: '/auth',
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
    }
  ]
}
