const whitelistModel = require('../models/whitelist');

class ProcessWhitelistRequest {
    getWhitelistData() {
         return whitelistModel.getWhitelistFilter()
        .then(
            ([data, whtlstId]) => {
                if (data) {
                    return Promise.resolve({"data": data, "id": whtlstId});
                } else {
                    whitelistModel.initialWhitelist();
                    return Promise.resolve(whitelistModel.getWhitelistFilter());
                }
            },
        );
    }
}

module.exports = new ProcessWhitelistRequest();
