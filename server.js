const express = require("express"),
  bodyParser = require('body-parser'),
  mediator = require('./mediator/mediator'),
  mediatorTrasnactions = require('./mediator/mediator-Transactions'),
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
  messageId = '',
  dateTime = new Date().toISOString();

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

app.post('/transfer/transferOrder', async function (req, res) {
  messageId = req.headers['message-id'];
  try {
    response = await mediatorTrasnactions.transferOrder(req.body, messageId);
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

app.post('/transaction/postTXN', async function (req, res) {
  messageId = req.headers['message-id'];
  try {
    response = await mediatorTrasnactions.postTXN(req.body, messageId);
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

//Default error
app.use(function (req, res, next) {
  let reponseError = {
    'status': 'error',
    'errorCode': 404,
    'errorMessage': 'Internal Server Error',
    'errorDescription': 'URL not found',
  };
  res.status(404).send(setErrorMessage(reponseError));
});

app.listen(config.port, () => {
  console.log("El servidor está inicializado en el puerto " + config.port);
});

function setErrorMessage(error) {
  response.metaData.status = error.status || 'error';
  response.metaData.dateTime = dateTime;
  response.metaData.messageId = error.messageId || messageId;
  response.metaData.statusCode = error.errorCode || 500;
  response.data = {
    message: error.errorMessage || 'Internal Server Error',
    description: error.errorDescription || 'Error desconocido'
  }
  return response;
}