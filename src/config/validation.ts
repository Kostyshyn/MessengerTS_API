export default {
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
  },
  'Origin': {
    NAME: {
      MIN_LENGTH: 6,
      MAX_LENGTH: 22,
      REGEX: /^[A-Za-z0-9]+(?:[_.][A-Za-z0-9]+)*$/
    },
    ORIGIN_URL: {
      MIN_LENGTH: 6
    }
  }
};
