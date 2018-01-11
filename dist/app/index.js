"use strict";
module.exports = {
    pkg: require(`${process.cwd()}/package`),
    config: require('./config'),
    api: {
        models: {},
        policies: {},
        controllers: require('./api/controllers')
    }
    // api: require('./api')
};
