export default {
  ALLOWED_ROUTER_METHODS: ['get', 'post', 'put', 'delete'],
  DEFAULTS: {
    PROFILE_IMG: 'defaults/images/user/128_profile_placeholder.png'
  },
  FILES: {
    MAX_FILE_SIZE_MB: 0.5,
    IMAGE: {
      ACCEPT_FILES: [
        'image/jpeg',
        'image/jpg',
        'image/png'
      ],
      DEF_EXT: 'jpg',
      CROP_SIZES: [68, 128, 720, 1080]
    }
  },
  LOGGER: {
    ERRORS_TO_EXIT: ['Error', 'TypeError'],
    ERRORS_TO_LOG: ['Error', 'TypeError', 'MongoError', 'HttpExceptionError']
  },
  PAGINATION: {
    'User': {
      PER_PAGE: 20
    },
    'Image': {
      PER_PAGE: 50
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
    },
    'Image': {
      ORIGINAL_NAME: {
        MAX_LENGTH: 255,
      }
    }
  }
};