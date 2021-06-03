define([
  "libs/lodash/lodash.min",
  "constants"
], function(
  lodash,
  constants
) {
  const {THUMBNAIL_URLS} = constants;

  function getStyleParams(data, thumbnailUrls = THUMBNAIL_URLS) {
    let styleParamsString = null;

    for (const url of thumbnailUrls) {
      const styleParams = lodash.get(data, url);
      if (styleParams) {
        styleParamsString = lodash.isObject(styleParams)
          ? encodeURIComponent(JSON.stringify(styleParams)) : styleParams;
        break;
      }
    }

    return styleParamsString;
  }

  return {
    getStyleParams
  };
});
