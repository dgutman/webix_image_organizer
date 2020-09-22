define(["helpers/ajax", "helpers/authentication"], function(ajax, auth) {
   return {
       getTemplate: function(data) {
            let img = `<img src="assets/imgs/no-image.png" style="width: 90%" class="template-image">`

            let src = `${ajax.getHostApiUrl()}/item/${data.data._id}/tiles/thumbnail?token=${auth.getToken()}`;
            if (data.filename || data.filesrc) {
                src = data.filename ? "/api/images/" + data.filename : data.filesrc;
            }
            img = `<img src="${src}" class="template-image">`

            const name = data.data.name || "no image";

            const template = `<div class="template-image-wrap">
                                <div class='template-image-flexible-element'>
                                    <p class="template-image-name">${name}</p>
                                    ${img}
                                </div>
                            </div>`
            return template;
       }
   }
});