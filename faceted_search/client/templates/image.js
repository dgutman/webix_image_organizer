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
       getTemplate: function(data, params) {
            const requestParams = params || {};
            const paramsArray = Object.entries(requestParams);
            const styleParamsString = styleParams.getStyleParams(data.data);
            if (styleParamsString) {
              paramsArray.push(["style", styleParamsString]);
            }
            const token = auth.getToken();
            if (token) {
              paramsArray.push(["token", token]);
            }
            const searchParams = new URLSearchParams("");
            paramsArray.forEach((item) => { searchParams.append(...item); });
            const queryString = searchParams.toString();
            let src = `${ajax.getHostApiUrl()}/item/${data.data._id}/tiles/thumbnail?${queryString || ""}`;

            if (styleParamsString) {
              src += `&style=${styleParamsString}`;
            }

            if (data.filename || data.filesrc) {
                src = data.filename ? `/api/images/${data.filename}` : data.filesrc;
            }

//            const name = data.data.name || "no image";
            console.log(data.data);
            const name = data.data?.meta?.pilotSchema?.ADRC || "";
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
