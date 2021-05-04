const whitelist = require('../models/whitelist');

const getProps = (req, res) => {
    whitelist.getWhitelist()
        .then(
            (data) => {
                if (data) {
                    res.status(200).send(data);
                } else {
                    whitelist.initialWhitelist();
                }
            },
            (err) => res.status(500).send(err)
        )
        .catch((reason) => {
            console.error(reason);
        });
};

module.exports = getProps;
