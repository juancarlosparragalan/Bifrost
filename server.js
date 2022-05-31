const express = require("express"),
  bodyParser = require('body-parser'),
  mediator = require('./mediator/mediator'),
  {
    config
  } = require('./config/config');
var cors = require('cors'),
  response = {
    'metaData': {
      'status': '',
      'messageId': '',
    },
    'data': {}
  },
  messageId = '';

const app = express();
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(cors());
//healt server
app.get('/', function (req, res) {
  response = {
    code: 200,
    message: 'Server Up!'
  };
  res.send(response);
});
//Employee validation
app.get('/employee/validation', async function (req, res) {
  messageId = req.headers['message-id'];
  try {
    response = await mediator.employeeValidation(req.query.federalId, req.query.RFCCompany, messageId);
  } catch (error) {
    setErrorMessage(error);
    res.status(error.errorCode || 500);
  }
  res.status(response.metaData.statusCode);
  console.log(response);
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Headers', "*");
  res.header('Access-Control-Allow-Methods', "*");
  res.send(response);
});
//Employee information
app.get('/employee/information', async function (req, res) {
  messageId = req.headers['message-id'];
  try {
    response = await mediator.employeeInformation(req.query.federalId, req.query.RFCCompany, messageId);
  } catch (error) {
    setErrorMessage(error);
    res.status(error.errorCode || 500);
  }
  res.status(response.metaData.statusCode);
  console.log(response);
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Headers', "*");
  res.header('Access-Control-Allow-Methods', "*");
  res.send(response);
});

app.use(function (req, res, next) {
  response = {
    error: true,
    code: 404,
    message: 'URL no encontrada'
  };
  res.status(404).send(response);
});

app.listen(config.port, () => {
  console.log("El servidor está inicializado en el puerto " + config.port);
});

function setErrorMessage(error) {
  response.metaData.status = error.status || 'error';
  response.metaData.messageId = error.messageId || messageId;
  response.metaData.statusCode = error.errorCode || 500;
  response.data = {
    message: error.errorMessage || 'Internal Server Error',
    description: error.errorDescription || 'Error desconocido'
  }
  return response;
}