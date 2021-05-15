const whitelistModel = require('../models/whitelist');

class ProcessWhitelistRequest {
    getWhitelistData() {
         return whitelistModel.getWhitelist()
        .then(
            async ({data, updatedAt}) => {
                if (data) {
                    return Promise.resolve({data, updatedAt});
                } else {
                    await whitelistModel.initialWhitelist();
                    return this.getWhitelistData();
                }
            },
        );
    }
}

module.exports = new ProcessWhitelistRequest();
