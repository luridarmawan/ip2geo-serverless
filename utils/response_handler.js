
var code = 200;

var response = {
    responseData: {},
    get data(){
        return this.responseData
    },
    set data(AValue){
        this.responseData = AValue;
    } 
};

var responseHeaders = {};

function status( codeStatus){
    code = codeStatus;
}

function header( key, value){
    responseHeaders[key] = value;
}
function set( key, value){
    header( key, value)
}

function type( value){
    header( 'Content-Type', value)
}

function json(data = {}){
    response = data;
    return data;
}

function getResponseCode(){
    return code;
}

function getResponseBody(){
    return response;
}

function getResponseHeaders(){
    return responseHeaders;
}

function send(){
}

module.exports = {
    json,
    header,
    set, // same with header
    type, // Content-Type header
    status,
    getResponseCode,
    getResponseBody,
    getResponseHeaders,
    send
}
