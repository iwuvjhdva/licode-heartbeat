var extend = require('extend');

var defaultConfig = {
    serviceID: '53d8535f0f795a55a47beeac',
    serviceKey: '4890',
    host: 'http://licode.socio2.net:3000/',
    roomName: 'galaxy-room'
};

var localConfig;
try {
    localConfig = require('/etc/licode_heartbeat');
} catch (err) {
    console.error(err.message);
    localConfig = {};
}

module.exports = extend(true, defaultConfig, localConfig);
