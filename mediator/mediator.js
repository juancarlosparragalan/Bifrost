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

        //console.log(process.env);

        let request, path, response;

        result.metaData.messageId = messageId;
        //validacion de parametros de entrada
        if (!federalId) {
            throwError(title, 400, 'Missing parameters', 'Missing federalId parameter');
        }
        if (!RFCCompany) {
            throwError(title, 400, 'Missing parameters', 'Missing RFCCompany parameter');
        }
        //set request path
        path = config.basicPath + '/valid' + '?RFCCompany=' + RFCCompany + '&federalId=' + federalId;
        try {
            //Send request to adapter
            response = await adapter.restRequest(verb, request, path, config.authMethod);
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
        logger.loggerFunction('Employee Information Start', messageId);
        result.metaData.messageId = messageId;
        let request, path, response;
        //validacion de parametros de entrada
        if (!federalId) {
            throwError(title, 400, 'Missing parameters', 'Missing federalId parameter');
        }
        if (!RFCCompany) {
            throwError(title, 400, 'Missing parameters', 'Missing RFCCompany parameter');
        }
        //set request path
        path = config.basicPath + '/info' + '?RFCCompany=' + RFCCompany + '&federalId=' + federalId;
        try {
            //Send request to adapter
            response = await adapter.restRequest(verb, request, path, config.authMethod);
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