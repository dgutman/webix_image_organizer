const express = require('express');

const ServiceData = require('../models/service_data');

let router = express.Router();

module.exports = (app) => {
    router.get('/:hostId', function(req, res, next) {
        let hostId = req.params.hostId;
        ServiceData.getHostsList()
        .then((result) => {
			let hostsList = result.data;
			const currenHost = hostsList.find((host) => host.id == hostId);
            if(currenHost){
                req.session.host = currenHost;
            };
            res.status(200).send();
        })
        .catch(err => next(err));
    });

    app.use('/host', router);
};