import OriginService from '@services/Origin/index';
import config from '@config/index';

const { ORIGIN } = config.DEFAULTS;

export const originsSeed = async (): Promise<string> => {
  try {
    await OriginService.updateOrigin({
      origin_url: ORIGIN
    }, {
      $set: {
        name: 'Default',
        origin_url: ORIGIN,
        isDefault: true
      }
    }, {
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true,
      context: 'query'
    });
    return 'The seed of origins is created';
  } catch (err) {
    throw err;
  }
};
