import * as path from 'path';

export default {
	ALLOWED_ROUTER_METHODS: ['get', 'post', 'put', 'delete'],
	FILES: {
		DEF_PROFILE_IMG: 'defaults/images/user/128_profile_placeholder.png'
	},
	LOGGER: {
		ERRORS_TO_LOG: ['Error', 'MongoError']
	},
	PAGINATION: {
		'User': {
			PER_PAGE: 20
		}
	}
};