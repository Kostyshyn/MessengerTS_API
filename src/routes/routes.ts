const { API_VERSION } = process.env;

import auth from '@routes/auth'
import users from '@routes/users'
import admin from '@routes/admin'

export default [
  {
    route: `/v${API_VERSION}`,
    children: [
      auth, // Auth module
      users, // Users module
      admin // Admin module
    ]
  }
];
