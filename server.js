const express = require("express");
const bodyParser = require('body-parser');
const mediator = require('./mediator/mediator');
var cors = require('cors');

const app = express();
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(cors());
let usuario = {
  name: '',
  documentNumber: '',
  transactionId: ''
};
let response = {
  error: true,
  code: 500,
  message: 'Internal Error'
};

app.get('/', function (req, res) {
  response = {
    code: 200,
    message: 'Server Up!'
  };
  res.send(response);
});
app.get('/employee/validation', async function (req, res) {
  console.log(req);
  response = await mediator.employeeValidation(req.query.federalId, req.query.RFCCompany);
  console.log(response);
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Headers', "*");
  res.header('Access-Control-Allow-Methods', "*");
  res.send(response);
});

app.get('/employee/information', async function (req, res) {
  response = await mediator.employeeInformation(req.query.federalId, req.query.RFCCompany);
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
app.listen(3000, () => {
  console.log("El servidor está inicializado en el puerto 3000");
});