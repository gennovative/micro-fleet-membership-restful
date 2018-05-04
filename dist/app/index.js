"use strict";
module.exports = {
    pkg: require(`${process.cwd()}/package`),
    config: require('./config'),
    controllers: require('./api/controllers'),
    api: {
        models: {},
        policies: {},
        controllers: {},
    }
    // api: require('./api')
};
