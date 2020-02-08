import * as path from 'path';

export default {
	ALLOWED_ROUTER_METHODS: ['get', 'post', 'put', 'delete'],
	FILES: {
		DEF_PROFILE_IMG: 'public_images/128_profile_placeholder.png'
	},
	LOGGER: {
		ERRORS_TO_LOG: ['Error', 'MongoError']
	}
};