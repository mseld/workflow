var moment = require('moment');
var uuidv4 = require('uuid/v4');
var Promise = require("bluebird");
var sms = require('../lambda/voice');

/*
    var request = {
        "workflow_task_destination": [{
            mobile: '201000525849',
            email: 'm.samy@cequens.com'
        }],
        "workflow_task_external_id": "12394849",
        "workflow_task_metadata": {
            "sms": {
                "from": "Cequens",
                "text": "Your Cequens verification code is 2345",
                "message_type": "text",
                "channel_timeout": "30"
            },
            "voice": {
                "from": "966512345678",
                "text": "Your Cequens verification code is 2 3 4 5",
                "language": "ar",
                "channel_timeout": "30"
            }
        }
    };
*/
exports.startWorkflowTask = function(req, res, next) {
    try {

        //TODO: Validate request body schema.
        //TODO get all tasks by workflow Id

        var destinations = req.body.workflow_task_destination;

        var workflowObject = {
            request_Id: req.requestId,
            workflow_Id: req.params.workflowId,
            access_token: req.headers.authorization,
            external_id: req.body.workflow_task_external_id || "",
            metadata: req.body.workflow_task_metadata
        };

        Promise
            .map(destinations, function(item) {
                return new Promise(function(resolve) {
                    var obj = Object.assign({}, workflowObject, { destination: item });
                    return resolve(obj);
                });
            })
            .each(function(messageObj) {
                return new Promise(function(resolve) {
                    sms.handler(messageObj, null, function(err, data) {
                        if (err) {
                            console.log(err);
                        }
                        console.log(data);
                        return resolve(data);
                    });
                });
            }).then(function() {

                var response = {
                    message: 'welcome'
                };

                return res.ok(response, workflowObject.external_id);

            }).catch(function(err) {
                console.log("Error : " + err.message);
                var _err = new Error(ex.message);
                _err.statusCode = 400;
                return res.status(400).json(_err);
            });

    } catch (ex) {
        console.log('DNS Exception : ' + ex.message);
        var _err = new Error(ex.message);
        _err.statusCode = 400;
        return res.status(400).json(_err);
    }
};


exports.getWorkflowTaskInfo = function(req, res, next) {
    try {
        //var num = req.params.number || req.query.number;
        var response = {};
        // console.log('Response : ' + JSON.stringify(response, null, 2));
        return res.status(200).json(response);
    } catch (ex) {
        console.log('DNS Exception : ' + ex.message);
        var _err = new Error(ex.message);
        _err.statusCode = 400;
        return res.status(400).json(_err);
    }
};