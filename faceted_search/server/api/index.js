/* eslint new-cap: ["error", {"properties": false}] */
/* eslint max-len: 0 */

const express = require('express');
const fs = require('fs');
const errorHandler = require("../etc/errorHandler");

const ServiceData = require('./models/service_data');

function handleIndexRoutes(req, res, next) {
    let adminMode = false;
    if(req.url === '/admin') adminMode = true;
    const currentSkin = adminMode ? req.session.admin_skin : req.session.user_skin;

    Promise.all([
            ServiceData.getSkinsList(),
            ServiceData.getSkinExtensionsList(),
            ServiceData.getHostsList()
    ])
    .then(([skins, extensions, hosts]) => {
        const skinsList = skins.data;
        const skinsExtensionsList = extensions.data;
        const defaultSkin = skinsList.includes("flat") ? "flat" : skinsList[0];

        const currentHost = req.session.host || hosts.data[0];
        const data = {hostsList: hosts.data};
        if(adminMode) {
            if(!currentSkin || !skinsList.includes(currentSkin)) req.session.admin_skin = defaultSkin;
            Object.assign(data, {
                skin: req.session.admin_skin,
                skinExtension: skinsExtensionsList.includes(req.session.admin_skin) || false,
                skinsList: skinsList,
                userMode: false
            });
        } else {
            if(!currentSkin || !skinsList.includes(currentSkin)) req.session.user_skin = defaultSkin;
            Object.assign(data, {
                skin: req.session.user_skin,
                skinExtension: skinsExtensionsList.includes(req.session.user_skin) || false,
                skinsList: skinsList,
                userMode: true
            });
        }
        req.session.host = hosts.data.find((host) => host.id === currentHost.id) || hosts.data[0];
        data.host = req.session.host;
        res.render('index.pug', {data: data, mode: process.env.NODE_ENV || "development"});
    })
    .catch((err) => next(err));
}


module.exports = function(app) {
    const apiRouter = express.Router();

    app.use(errorHandler);

    fs.readdir('./server/api/routes', (error, files) => {
        if (error) {
            throw error;
        } else {
            files.forEach((file) => {
                require('./routes/' + file.substring(0, file.lastIndexOf('.')))(apiRouter);
            });
        }
    });
    app.get('/admin', handleIndexRoutes);
    app.get('/', handleIndexRoutes);
    app.get('/user', handleIndexRoutes);

    return apiRouter;
};
