import protectedRoute from '@middlewares/protected';
import AuthController from '@controllers/Auth';
import UserController from '@controllers/User';

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
			}
		]
	}
];

// example

// {
// 	route: '/api',
// 	middleware: [(req, res, next) => {
// 		console.log('API middleware');
// 		next();
// 	}],
// 	controller: (req, res, next) => {
// 		res.json({
// 			message: 'Hello from API'
// 		});
// 	},
// 	children: []
// }

