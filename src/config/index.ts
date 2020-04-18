import * as path from 'path';

export default {
  ALLOWED_ROUTER_METHODS: ['get', 'post', 'put', 'delete'],
  FILES: {
    DEF_PROFILE_IMG: 'defaults/images/user/128_profile_placeholder.png',
    ACCEPT_FILES_IMG: [
      'image/jpeg',
      'image/jpg',
      'image/png'
    ],
    MAX_FILE_SIZE_MB_IMG: 0.5
  },
  LOGGER: {
    ERRORS_TO_LOG: ['Error', 'MongoError', 'HttpExceptionError']
  },
  PAGINATION: {
    'User': {
      PER_PAGE: 20
    }
  },
  VALIDATION: {
    'User': {
      NAME: {
        MIN_LENGTH: 3,
        MAX_LENGTH: 22,
        REGEX: /^[A-Za-z0-9]+$/
      },
      USERNAME: {
        MIN_LENGTH: 6,
        MAX_LENGTH: 22,
        REGEX: /^[A-Za-z0-9]+(?:[_.][A-Za-z0-9]+)*$/
      },
      PASSWORD: {
        MIN_LENGTH: 6,
        MAX_LENGTH: 22
      }
    }
  }
};