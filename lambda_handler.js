/*
  [x] How to local test, using serverless
  serverless invoke local -f ip2geo

  [x] local test, with serverless offline
  serverless offline start

  [x] local test, with services/nodemon
  run:
    nodemon index.js

  test:
    curl "http://localhost:3000/8.8.8.8"

  [x] local test, dummy test
  node lambda_handler.js

*/
'use strict';

const DEBUG_LOCAL = false;

const fs = require('fs');
const ip2geo = require('./controllers/ip2geo_controller').ip2geo;
const res = require('./utils/response_handler');

module.exports.ip2GeoBridge = async (event, context, callback) => {
  let requestHeaders = ''; //event['headers'] == undefined ? '' : event['headers'];
  let httpMethod = event['httpMethod'] == undefined ? 'function' : event['httpMethod'];
  let requestParams = event['pathParameters'] == undefined ? {} : event['pathParameters'];
  let requestQuery = event['queryStringParameters'] == undefined ? {} : event['queryStringParameters'];
  let requestQueryAsString = generateQueryString(requestQuery);
  let requestBody = event['body'] == undefined ? {} : event['body'];
  let moduleName = requestQuery.mod;
  let responseBody = {};
  let responseHeaders = {};
  let request = {
    headers: requestHeaders,
    query: requestQuery,
    params: requestParams,
  }
  try {
    requestBody = JSON.parse(requestBody);
    request.body = requestBody;
  } catch (e) {
  }

  //----- manual echo
  /*
  responseBody = {
    statusCode: 202,
    message: 'ECHO Function',
    method: httpMethod,
    headers: requestHeaders,
    params: requestParams,
    query: requestQuery,
    queryAsString: requestQueryAsString,
    body: requestBody,
    //input: event,
  };
  */


  //------- YOUR CODE HERE
  
  if (httpMethod == 'GET'){
    ip2geo(request,res);
  }
  if (httpMethod == 'OPTIONS'){
    res.status(204);
  }
  
  
  // header and body wrapper from existing api controller
  responseBody = res.getResponseBody();
  responseHeaders = res.getResponseHeaders();

  //------- YOUR CODE - END
  if (DEBUG_LOCAL) {
    callback(null, responseBody);
  }

  responseHeaders['x-build-with'] = 'fastplaz';
  return {
    statusCode: res.getResponseCode(),
    headers: responseHeaders,
    body: JSON.stringify(responseBody),
  };
};

function generateQueryString(AQuery) {
  var s = '';
  for (var item in AQuery) {
    s += item + '=' + AQuery[item] + '&';
  }
  s = s.substring(0, s.length - 1);
  return s;
}

function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

function isNumeric(s) {
  //return (typeof s == "number" && !isNaN(s));
  var n = parseInt(s);
  if (s == n) {
    return true;
  }
}

function callbackFunction(par1, AResponse) {
  console.log(AResponse);
}

//local debug only
if (DEBUG_LOCAL) {
  console.log('LOCAL DEBUG');
  //var s = fs.readFileSync('template/post.json', { encoding: 'utf8' });
  let event = {
    httpMethod: 'GET',
    queryStringParameters: {
      var1: 'value 1'
    }
  }
  module.exports.ip2GeoBridge(event, '', callbackFunction);
}

