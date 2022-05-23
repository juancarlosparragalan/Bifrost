var adapter = require('../adapter/adapter'),
    logger = require('../logger/logger');

const verb = 'GET',
    authMethod = 'apiKey',
    operationPath = '/zwscom/Mox/api/Employee/',
    title = 'Mediator-Error',
    internalError = 'Internal Error';

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
    async employeeValidation(federalId, RFCCompany) {
        logger.loggerFunction('Employee Validation', 'Start');
        let result = {},
            request, path, response;
        //validacion de parametros de entrada
        if (!federalId) {
            throwError(title, 400, 'Missing parameters', 'Missing federalId parameter');
        }
        if (!RFCCompany) {
            throwError(title, 400, 'Missing parameters', 'Missing RFCCompany parameter');
        }
        //set request path
        path = operationPath + '/valid' + '?RFCCompany=' + RFCCompany + '&federalId=' + federalId;
        try {
            //Send request to adapter
            response = await adapter.restRequest(verb, request, path, authMethod);
        } catch (error) {
            //Catch error
            if (error.errorDescription) {
                return result = {
                    'status': 'error',
                    'message': setErrorMessage()[error.errorDescription.code] || 'Internal Server Error'
                };
            }
        }
        //If response is not ok
        if (response.code != 200) {
            result = {
                status: 'fail',
                RFCCompany,
                message: response.body.msg
            }
        } else
            //If response has invalid data
            if (!response.body.data.employeeIsValid || !response.body.data.employeeIsActive) {
                result = {
                    status: 'fail',
                    federalId,
                    message: response.body.data
                }
            } else {
                //If response is ok
                result = {
                    status: 'success',
                    message: response.body.data
                }
            }
        //logger response
        //logger.loggerFunction('Mediator-Response', result, 'info');

        //return response
        return result;
    },
    async employeeInformation(federalId, RFCCompany) {
        logger.loggerFunction('Employee Information', 'Start');
        let result = {},
            request, path, response;
        //validacion de parametros de entrada
        if (!federalId) {
            throwError(title, 400, 'Missing parameters', 'Missing federalId parameter');
        }
        if (!RFCCompany) {
            throwError(title, 400, 'Missing parameters', 'Missing RFCCompany parameter');
        }
        //set request path
        path = operationPath + '/info1' + '?RFCCompany=' + RFCCompany + '&federalId=' + federalId;
        try {
            //Send request to adapter
            response = await adapter.restRequest(verb, request, path, authMethod);
        } catch (error) {
            //Catch error
            if (error.errorDescription) {
                return result = {
                    'status': 'error',
                    'message': setErrorMessage()[error.errorDescription.code] || 'Internal Server Error'
                };
            }
        }
        //If response is not ok
        if (response.code != 200) {
            result = {
                status: 'fail',
                RFCCompany,
                message: response.body.msg
            }
        } else {
            //If response is ok
            result = {
                status: 'success',
                message: response.body.data
            }
        }
        //return response
        return result;
    }
}