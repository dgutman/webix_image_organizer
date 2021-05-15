const whitelist = require('../models/whitelist');

const getProps = (req, res) => {
    whitelist.getWhitelistData()
        .then(
            (data) => {
                if (data) {
                    res.status(200).send(data);
                } else {
                    whitelist.initialWhitelist()
                        .then((data) => {
                            if(data) {
                                res.status(200).send(data);
                            } else {
                                res.status(404).send('Not found');
                            }
                        });
                }
            },
            (err) => res.status(500).send(err)
        )
        .catch((reason) => {
            res.status(500).send(reason);
        });
};

module.exports = {getProps};
