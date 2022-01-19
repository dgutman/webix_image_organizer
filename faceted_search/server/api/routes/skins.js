const express = require('express');

const ServiceData = require('../models/service_data');

let router = express.Router();

module.exports = (app) => {
    router.get('/user/:skin', function(req, res, next) {
        let skin = req.params.skin;
        ServiceData.getSkinsList()
        .then((result) => {
            let skinsList = result.data;
            if(skinsList.includes(skin)){
                req.session.user_skin = skin;
            };
            res.status(200).send();
        })
        .catch(err => next(err));
    });

    router.get('/admin/:skin', function(req, res, next) {
        let skin = req.params.skin;
        ServiceData.getSkinsList()
        .then((result) => {
            let skinsList = result.data;
            if(skinsList.includes(skin)){
                req.session.admin_skin = skin;
            };
            res.status(200).send();
        })
        .catch(err => next(err));
    });

    app.use('/skin', router);
};