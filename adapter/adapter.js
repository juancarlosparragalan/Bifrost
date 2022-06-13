//lib ADAPTER v1.5
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
        var response = {}, contentTypeHeader,
            backend = getUrl(config.BackendHost, config.BackendPort, path); //set backend url
            //backend = 'https://localhost:8000/serverUp';
        try {
            req.open(verb, backend, false);
            logger.loggerFunction('Sending Request to', backend);
            logger.loggerFunction('Verb request', verb);
            logger.loggerFunction('Authentication method', authenticationMethod);
            logger.loggerFunction('Request Body', request);
            //evaluate authentication method
            if (authenticationMethod == 'basic') {
                req.setRequestHeader('Authorization', 'Basic ' + basicAuth);
            } else
            if (authenticationMethod == 'apiKey') {
                req.setRequestHeader('x-api-key', config.apiKey);
                req.setRequestHeader('x-api-secret', config.apiSecret);
            }
            contentTypeHeader = req.getRequestHeader('Content-Type');
            if (!contentTypeHeader)
                req.setRequestHeader('Content-Type', config.ContentType); //set content type
            req.send(JSON.stringify(request)); //send request
            logger.loggerFunction('Full Response Logging', req);
            if (req.readyState == 4 && req.status == 200) {
                response.code = req.status;
                response.body = JSON.parse(req.responseText);
                logger.loggerFunction('Success Response', response);
            } else
            if (req.status == 404 && req.responseText) {
                response.code = req.status;
                if (typeof req.responseText == 'string') {
                    response.body = 'Backend URL not found';
                } else {
                    response.body = JSON.parse(req.responseText);
                }
                throwError(title, req.status, 'Error on Transaction', response.body);
            } else
            if (req.status > 200 && req.responseText) {
                response.code = req.status;
                response.body = JSON.parse(req.responseText);
                logger.loggerFunction('Error Response', response, 'error');
            } else {
                throwError(title, 500, 'Error on Transaction', req.statusText);
            }
        } catch (error) {
            throwError(title, error.errorCode || 500, error.errorMessage || 'Transaction Error', error.errorDescription);
        }
        return response;
    }
}