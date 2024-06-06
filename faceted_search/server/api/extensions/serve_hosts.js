const ServiceData = require('../models/service_data');
const config = require('../../../config');
const hosts = config.hosts_list;

module.exports = () => {
    ServiceData.updateHosts(hosts)
    .then(() => {
        console.log('Hosts are served');
    })
    .catch(err => console.log(err));
};
