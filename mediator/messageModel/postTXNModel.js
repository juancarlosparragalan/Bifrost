//require('dotenv').config();

const data = {
    "transactionInfo": {
        "transactionId": "", //Id de transaccion  (podriamos asociarlo al messageId?)
        "transactionType": "", //tipo de transaccion
        "deliveryType": "", //preguntar
        "originator": "" //entidad que origina la transaccion
    },
    "transactionStatus": {
        "status": "", //estado
        "statusCode": "", //codigo de estado
        "description": "" //descripcion de estado
    },
    "employeeInfo": {
        "federalId": "", //rfc del empleado
        "companyId": "" //rfc de la empresa
    },
    "data": "", //preguntar
    "gateway": "", //preguntar
    "confirmedAmount": {
        "amount": "",
        "currency": "",
        "fee": ""
    },
    "withdrawalDatetime": "", //fecha de retiro
    "fullFilled": "" //preguntar
}

module.exports = {
    data
};