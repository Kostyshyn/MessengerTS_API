import auth from '@routes/auth'
import users from '@routes/users'
import admin from '@routes/admin'

export default [
  {
    route: '/api',
    children: [
      auth, // Auth module
      users, // Users module
      admin // Admin module
    ]
  }
];
