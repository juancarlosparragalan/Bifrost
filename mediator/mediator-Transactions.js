// lib Mediator v1.6
var adapter = require('../adapter/adapter'),
    logger = require('../logger/logger');
const {
    config
} = require('../config/config'),
    postTXNModel = require('./messageModel/postTXNModel'),
    verb = 'POST',
    microservice = config.serviceName,
    title = 'Mediator-Transactions-Error',
    internalError = 'Internal Error';

var result = {
        'metaData': {
            'status': '',
            'messageId': '',
        },
        'data': {}
    },
    dateTime = new Date().toISOString();

function setErrorMessage() {
    return {
        ENOTFOUND: 'Not found Endpoint to establish a backside connection',
        ETIMEDOUT: 'Time out to establish a backside connection'
    };
}

function validateRequest(request, model) {
    let dataRequest = request.data,
        dataModel = model.data;
    if (!dataRequest) {
        throwError(title, 400, 'Bad Request', 'Missing data parameter');
    }
    for (key in dataModel) {
        if (!dataRequest[key]) {
            throwError(title, 400, 'Bad Request', 'Invalid data, no ' + key + ' Found');
        }
    }
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
    async transferOrder(body, messageId) {
        //Declare variables
        let request, path, response;
        //Sets the messageId
        if (!messageId) {
            process.env.MSGID = '000-000-000';
            throwError(title, 400, 'Missing parameters', 'Missing message-id Header');
        } else
            process.env.MSGID = messageId;
        //set request path
        path = config.basePath + '/transfer/transferOrder';
        //log Start transaction
        logger.loggerFunction('transferOrder Start', messageId);
        //Set Metadata
        result.metaData.messageId = messageId;
        result.metaData.dateTime = dateTime;
        result.metaData.apiName = microservice;
        result.metaData.path = path;
        //validacion de parametros de entrada
        if (!body.data) {
            throwError(title, 400, 'Missing parameters', 'Missing data parameter');
        } else
            request = body.data;
        try {
            //Send request to adapter
            response = await adapter.restRequest(verb, request, path, config.authMethod);
        } catch (error) {
            //Catch error
            if (error.errorDescription) {
                result.metaData.status = 'error';
                result.metaData.statusCode = 500;
                result.data.message = setErrorMessage()[error.errorDescription.code] || 'Internal Server Error';
                logger.loggerFunction('transferOrder Result', result, 'error');
                return result;
            }
        }
        //If response is not ok
        if (response.code != 200) {
            result.metaData.status = 'fail';
            result.metaData.statusCode = response.code;
            result.data = response.body.msg;
        } else {
            //If response is ok
            result.metaData.status = 'success';
            result.metaData.statusCode = response.code;
            result.data = response.body.data;
        }
        logger.loggerFunction('transferOrder Result', result);
        return result;
    },
    async postTXN(body, messageId) {
        //Declare variables
        let request, path, response, result = {
            'metaData': {
                'status': '',
                'messageId': ''
            },
            'data': {}
        },
        dateTime = new Date().toISOString();
        //Sets the messageId
        if (!messageId) {
            process.env.MSGID = '000-000-000';
            throwError(title, 400, 'Missing parameters', 'Missing message-id Header');
        } else
            process.env.MSGID = messageId;
        //set request path
        path = config.basePath + '/Transaction/postTXN';
        //log Start transaction
        logger.loggerFunction('postTXN Start', messageId);
        //Set Metadata
        result.metaData.messageId = messageId;
        result.metaData.dateTime = dateTime;
        result.metaData.apiName = microservice;
        //result.metaData.path = path;
        //validacion de parametros de entrada
        validateRequest(body, postTXNModel);
        request = body.data;
        try {
            //Send request to adapter
            response = await adapter.restRequest(verb, body, path, config.authMethod);
        } catch (error) {
            //Catch error
            if (error.errorDescription) {
                result.metaData.status = 'error';
                result.metaData.statusCode = error.errorCode || 500;
                result.data.message = setErrorMessage()[error.errorDescription.code] || error.errorMessage || 'Internal Server Error';
                result.data.description = error.errorDescription || 'Internal Server Error';
                logger.loggerFunction('postTXN Result', result, 'error');
                return result;
            }
        }
        //If response is not ok
        if (response.code != 200) {
            result.metaData.status = 'fail';
            result.metaData.statusCode = response.code;
            result.data = response.body;
        } else {
            //If response is ok
            result.metaData.status = 'success';
            result.metaData.statusCode = response.code;
            result.data = response.body;
        }
        logger.loggerFunction('postTXN Result', result);
        return result;
    }
}