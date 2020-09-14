const fsp = require('fs-promise');

const ServiceData = require('../models/service_data');

const skinsDirectory = './client/libs/webix/skins';
const extensionsDirectory = skinsDirectory;

const parseDirectoryForCss = (files) => {
    let skins = [];
    for(let i = 0; i<files.length; i++){
        let [name, ext] = files[i].split('.');
        if(ext !== 'css') continue;
        skins.push(name);
    }
    return skins;
}

module.exports = () => {
    fsp.readdir(skinsDirectory)
    .then((files) => {
        let skins = parseDirectoryForCss(files);
        return ServiceData.addSkins(skins);
    })
    .then(() => {
        console.log('Skins are served');
        return fsp.readdir(extensionsDirectory);
    })
    .then((files) => {
        let extensions = parseDirectoryForCss(files);
        return ServiceData.addSkinsExtensions(extensions);
    })
    .then(() => {
        console.log('Extensions for skins are served');
    })
    .catch(err => console.log(err));
}