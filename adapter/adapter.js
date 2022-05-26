//lib ADAPTER
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest,
    logger = require('../logger/logger'),
    req = new XMLHttpRequest();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; //revisar despues
const {
    config
} = require('../config/config'),
    basicAuth = '', //traer todos estos campos de variables de entorno o de base de datos.
    title = 'Adapter-Error',
    internalError = 'Internal Server Error';


function getUrl(host, port, path) {
    if (!port) {
        port = '443';
    }
    return 'https://' + host + ':' + port + path;
}

function throwError(errorName = title, errorCode = 500, errorMessage = internalError, errorDescription = internalError) {
    let error = {
        errorName,
        errorCode,
        errorMessage,
        errorDescription
    };
    logger.loggerFunction(title, error, 'error');
    throw error;
}

module.exports = {
    async restRequest(verb, request = null, path, authenticationMethod = null) {
        var response = {},
            backend = getUrl(config.BackendHost, config.BackendPort, path); //set backend url
        try {
            req.open(verb, backend, false);
            logger.loggerFunction('Sending Request to', backend);
            logger.loggerFunction('Verb request', verb);
            logger.loggerFunction('Authentication method', authenticationMethod);
            //evaluate authentication method
            if (authenticationMethod == 'basic') {
                req.setRequestHeader('Authorization', 'Basic ' + basicAuth);
            } else
            if (authenticationMethod == 'apiKey') {
                req.setRequestHeader('x-api-key', config.apiKey);
                req.setRequestHeader('x-api-secret', config.apiSecret);
            }
            req.setRequestHeader('Content-Type', config.ContentType); //set content type
            req.send(JSON.stringify(request)); //send request
            logger.loggerFunction('Full Response Logging', req);
            if (req.readyState == 4 && req.status == 200) {
                response.code = req.status;
                response.body = JSON.parse(req.responseText);
                logger.loggerFunction('Success Response', response);
            } else
            if (req.status > 200 && req.responseText) {
                response.code = req.status;
                response.body = JSON.parse(req.responseText);
                logger.loggerFunction('Error Response', response, 'error');
            } else {
                throwError(title, 500, 'Error on Transaction', req.statusText);
            }
        } catch (error) {
            throwError(title, 500, 'Transaction Error', error.errorDescription);
        }
        return response;
    }
}