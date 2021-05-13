define([
  "helpers/ajax",
  "helpers/authentication",
  "constants",
  "libs/lodash/lodash.min"
], function(
  ajax,
  auth,
  constants,
  lodash
) {
  function getStyleParams(data) {
    let styleParamsString = null;
    const {THUMBNAIL_URLS} = constants;

    for (let url of THUMBNAIL_URLS) {
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
       getTemplate: function(data) {
            const styleParamsString = getStyleParams(data.data);
            let src = `${ajax.getHostApiUrl()}/item/${data.data._id}/tiles/thumbnail?token=${auth.getToken()}`;

            if (styleParamsString) {
              src += `&style=${styleParamsString}`;
            }

            if (data.filename || data.filesrc) {
                src = data.filename ? `/api/images/${data.filename}` : data.filesrc;
            }

            const name = data.data.name || "no image";

            return `
                <div class="template-image-wrap">
                    <div class='template-image-flexible-element'>
                        <p class="template-image-name">${name}</p>
                        <img src="${src}" class="template-image">
                    </div>
                    <div class="template-image-icons">
                        <img class="icon multichannel" src="assets/imgs/icons8-paint-palette-48.png">
                    </div>
                </div>
           `;
       }
   };
});
