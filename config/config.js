require('dotenv').config();

const config = {
    BackendHost: process.env.BACKENDHOST,
    BackendPort: process.env.BACKENDPORT,
    ContentType: process.env.CONTENTTYPE,
    apiKey: process.env.APIKEY,
    apiSecret: process.env.APISECRET,
    basicAuth: process.env.BASICAUTH,
    basicPath: process.env.BASICPATH,
    basePath: process.env.BASEPATH,
    authMethod: process.env.AUTHTYPE,
    serviceName: process.env.SERVICENAME,
    port: process.env.PORT
};

module.exports = {
    config
};