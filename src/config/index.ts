import VALIDATION from './validation';
import PAGINATION from './pagination';
import FILES from './files';
import GENERATORS from './generators';

export default {
  ALLOWED_ROUTER_METHODS: ['get', 'post', 'put', 'delete'],
  DEFAULTS: {
    ORIGIN: 'http://localhost:8080',
    PUBLIC_DIR: 'public',
    PRIVATE_DIR: 'storage',
    TMP_DIR: 'tmp',
    USER_DIR: 'user',
    PROFILE_IMG: 'defaults/images/user/128_profile_placeholder.png'
  },
  LOGGER: {
    ERRORS_TO_EXIT: ['Error', 'TypeError'],
    ERRORS_TO_LOG: ['Error', 'TypeError', 'MongoError', 'HttpExceptionError']
  },
  TEMPLATES_FOLDER: 'templates',
  TEMPLATES_EXT: 'ejs',
  FILES,
  PAGINATION,
  VALIDATION,
  GENERATORS
};
