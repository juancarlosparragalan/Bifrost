require('dotenv').config();
/*
const config = {
    BackendHost: process.env.BACKENDHOST || 'sandbox.zafirosoft.com',
    BackendPort: process.env.BACKENDPORT || '443',
    ContentType: process.env.CONTENTTYPE || 'application/json',
    apiKey: process.env.APIKEY || '123',
    apiSecret: process.env.APISECRET || '123',
    basicAuth: process.env.BASICAUTH || 'bW94OlduNy45a0dfMmQ=',
    basicPath: process.env.BASICPATH || '/zwscom/Mox/api/Employee',
    basePath: process.env.BASEPATH || '/zwscom/Mox/api',
    authMethod: process.env.AUTHTYPE || 'Basic',
    serviceName: process.env.SERVICENAME || 'Bifrost-Zafiro',
    port: process.env.PORT || '3000',
};
*/
const config = {
    BackendHost: process.env.BACKENDHOST || 'sandbox.zafirosoft.com',
    BackendPort: process.env.BACKENDPORT || '443',
    ContentType: process.env.CONTENTTYPE || 'application/json',
    apiKey: process.env.APIKEY || '123',
    apiSecret: process.env.APISECRET || '123',
    basicAuth: process.env.BASICAUTH || 'bW94OlduNy45a0dfMmQ=',
    basicPath: process.env.BASICPATH || '/zwscom/Mox/api/Employee',
    basePath: process.env.BASEPATH || '/zwscom/Mox/api',
    authMethod: process.env.AUTHTYPE || 'Basic',
    serviceName: process.env.SERVICENAME || 'Bifrost-Zafiro',
    port: process.env.PORT,
};
module.exports = {
    config
};