import protectedRoute from '@middlewares/protected';
import AuthController from '@controllers/Auth';
import UserController from '@controllers/User';

export default [
	{
		route: '/api',
		children: [
			{
				route: '/login',
				method: 'post',
				controller: AuthController.login
			},
			{
				route: '/register',
				method: 'post',
				controller: AuthController.register
			},
			{
				route: '/user',
				middleware: [protectedRoute],
				controller: UserController.fetchUser,
				children: [
					{
						route: '/:id',
						controller: UserController.getUserById
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

