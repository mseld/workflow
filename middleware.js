var moment = require('moment');
var uuidv4 = require('uuid/v4');
exports.init = function(req, res, next) {
    req.requestId = uuidv4();
    req.requestTime = moment().toISOString();
    next();
};

exports.uni_response = function(req, res, next) {

    var response = {
        requestId: req.requestId,
        requestTime: req.requestTime,
        replyCode: "",
        replyMessage: "",
        "clientRequestId": ""
    };

    var sendResponse = function(code, obj) {
        if (code >= 200 && code < 400) {
            response.data = obj;
        } else {
            response.error = obj;
        }

        return res.status(code).json(response);
    };

    res.ok = function(obj, ref) {
        response.replyCode = "200";
        response.replyMessage = "Request handled successfully.";
        response.clientRequestId = ref || "";
        return sendResponse(200, obj);
    };

    res.created = function(obj) {
        response.replyCode = "200";
        response.replyMessage = "Request handled successfully.";
        response.clientRequestId = ref || "";
        return sendResponse(201, obj);
    };

    res.BadRequest = function(obj) {
        response.replyCode = "400";
        response.replyMessage = "Parameters missing or invalid for requested resource or validations failed.";
        return sendResponse(200, obj);
    };

    res.InternalServerError = function(obj) {
        response.replyCode = "500";
        response.replyMessage = "The server encountered an unexpected condition which prevented it from fulfilling the request.";
        return sendResponse(500, obj);
    };

    next();
};