var adapter = require('../adapter/adapter'),
    logger = require('../logger/logger');
const {
    config
} = require('../config/config'),
    verb = 'GET',
    title = 'Mediator-Error',
    internalError = 'Internal Error';

var result = {
    'metaData': {
        'status': '',
        'messageId': '',
    },
    'data': {}
}

function setErrorMessage() {
    return {
        ENOTFOUND: 'Not found Endpoint to establish a backside connection',
        ETIMEDOUT: 'Time out to establish a backside connection'
    };
}

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
    async employeeValidation(federalId, RFCCompany, messageId) {
        //Sets the messageId
        if (!messageId) {
            process.env.MSGID = '000-000-000';
            throwError(title, 400, 'Missing parameters', 'Missing message-id Header');
        }
        process.env.MSGID = messageId;
        logger.loggerFunction('Employee Validation Start', messageId);

        let request, path, response, endpoint,
            operationPath = '/Employee/valid';

        result.metaData.messageId = messageId;
        //validacion de parametros de entrada
        if (!federalId) {
            throwError(title, 400, 'Missing parameters', 'Missing federalId parameter');
        }
        if (!RFCCompany) {
            throwError(title, 400, 'Missing parameters', 'Missing RFCCompany parameter');
        }

        //set backend endpoint
        endpoint = getUrl(config.BackendHost, config.BackendPort, config.basePath);
        endpoint = endpoint + operationPath + '?RFCCompany=' + RFCCompany + '&federalId=' + federalId;

        try {
            //Send request to adapter
            response = await adapter.sendRequest(verb, request, endpoint, config.authMethod);
        } catch (error) {
            //Catch error
            if (error.errorDescription) {
                result.metaData.status = 'error';
                result.metaData.statusCode = 500;
                result.data = setErrorMessage()[error.errorDescription.code] || 'Internal Server Error';
                return result;
            }
        }
        //If response is not ok
        if (response.code != 200) {
            result.metaData.status = 'fail';
            result.metaData.statusCode = response.code;
            result.metaData.RFCCompany = RFCCompany;
            result.data = response.body.msg;
        } else
            //If response has invalid data
            if (!response.body.data.employeeIsValid || !response.body.data.employeeIsActive) {
                result.metaData.status = 'fail';
                result.metaData.statusCode = 404;
                result.metaData.federalId = federalId;
                result.data = response.body.data;
            } else {
                //If response is ok
                result.metaData.status = 'success';
                result.metaData.statusCode = response.code;
                result.data = response.body.data;
            }
        return result;
    },
    async employeeInformation(federalId, RFCCompany, messageId) {
        //Sets the messageId
        if (!messageId) {
            process.env.MSGID = '000-000-000';
            throwError(title, 400, 'Missing parameters', 'Missing message-id Header');
        }
        process.env.MSGID = messageId;
        logger.loggerFunction('Employee Information Start', messageId);
        result.metaData.messageId = messageId;
        let request, path, response, endpoint, operationPath = '/Employee/info';
        //validacion de parametros de entrada
        if (!federalId) {
            throwError(title, 400, 'Missing parameters', 'Missing federalId parameter');
        }
        if (!RFCCompany) {
            throwError(title, 400, 'Missing parameters', 'Missing RFCCompany parameter');
        }
        //set backend endpoint
        endpoint = getUrl(config.BackendHost, config.BackendPort, config.basePath);
        endpoint = endpoint + operationPath + '?RFCCompany=' + RFCCompany + '&federalId=' + federalId;
        //set request path
        
        try {
            //Send request to adapter
            response = await adapter.sendRequest(verb, request, endpoint, config.authMethod);
        } catch (error) {
            //Catch error
            if (error.errorDescription) {
                result.metaData.status = 'error';
                result.metaData.statusCode = 500;
                result.data = setErrorMessage()[error.errorDescription.code] || 'Internal Server Error';
                return result;
            }
        }
        //If response is not ok
        if (response.code != 200) {
            result.metaData.status = 'fail';
            result.metaData.statusCode = response.code;
            result.metaData.RFCCompany = RFCCompany;
            result.data = response.body.msg;
        } else {
            //If response is ok
            result.metaData.status = 'success';
            result.metaData.statusCode = response.code;
            result.data = response.body.data;
        }
        //return response
        return result;
    }
}