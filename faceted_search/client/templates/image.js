define([
  "helpers/ajax",
  "helpers/authentication",
  "constants",
  "helpers/style_params",
  "models/multichannel_view/tiles_collection"
], function(
  ajax,
  auth,
  constants,
  styleParams,
  tilesCollection
) {
   return {
       getTemplate: function(data) {
            const styleParamsString = styleParams.getStyleParams(data.data);
            let src = `${ajax.getHostApiUrl()}/item/${data.data._id}/tiles/thumbnail?token=${auth.getToken()}`;

            if (styleParamsString) {
              src += `&style=${styleParamsString}`;
            }

            if (data.filename || data.filesrc) {
                src = data.filename ? `/api/images/${data.filename}` : data.filesrc;
            }

//            const name = data.data.name || "no image";
            console.log(data.data)
            const name = data.data?.meta?.pilotSchema?.ADRC || "no image";
            const viewIconSrc = tilesCollection.getChannelsFromChannelMap(data.data) ?
              "assets/imgs/icons8-paint-palette-48.png" : "assets/imgs/microscope.png";
            return `
                <div class="template-image-wrap">
                    <div class='template-image-flexible-element'>
                        <p class="template-image-name">${name}</p>
                        <img src="${src}" class="template-image">
                    </div>
                    <div class="template-image-icons">
                        <img class="icon multichannel" src="${viewIconSrc}">
                    </div>
                </div>
           `;
       }
   };
});
