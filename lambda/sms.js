/*
    Send Sms..
    log results step in database (dynamodb)
*/

var AWS = require('aws-sdk');
var moment = require('moment');
var uuidv4 = require('uuid/v4');
var Promise = require("bluebird");
var request = require("request");

AWS.config.update({ 'region': 'us-east-1' });

exports.handler = function(event, context, callback) {
    try {

        Promise.resolve()
            .then(() => {
                return new Promise(function(resolve) {

                    var options = {
                        method: 'POST',
                        url: 'http://api.cequens.com/cequens/api/v1/messaging',
                        headers: {
                            'content-type': 'application/json',
                            'authorization': event.access_token,
                        },
                        body: {
                            Recipients: event.destination.mobile,
                            SenderName: event.metadata.sms.from,
                            MessageText: event.metadata.sms.text,
                            MessageType: event.metadata.sms.message_type || "Text",
                        },
                        json: true
                    };

                    log(" Sending sms request with options : " + JSON.stringify(options.body, null, 2));

                    request(options, function(err, response, body) {
                        if (err) {
                            logError(err.message);
                            return resolve({ status: 0, message: err.message });
                        } else if (response.statusCode >= 200 && response.statusCode <= 300) {
                            log('SMS SENT');
                            return resolve({ status: 1 });
                        } else {
                            logError(JSON.stringify(body, null, 2));
                            return resolve({ status: 0, message: response.statusMessage });
                        }
                    });
                });
            })
            .then((data) => {

                var item = {
                    workflow_task_id: event.workflow_task_Id, // hash key
                    workflow_task_step_id: uuidv4(), // sort key      
                    workflow_task_step_channel: "sms",
                    workflow_task_step_from: event.metadata.sms.from,
                    workflow_task_step_destination: event.destination.mobile,
                    workflow_task_step_execution_order: "",
                    workflow_task_step_execution_status: data.status,
                    workflow_task_step_execution_timeout: event.metadata.sms.channel_timeout,
                    channel: "sms"
                };

                log("Adding a new item... : " + JSON.stringify(item, null, 2));

                saveRequest(item, function(err, data) {
                    if (err) logError(err.message);
                    else log('ITEM SAVED');
                    callback(null, event);
                });
            })
            .catch((err) => {
                logError(err.message);
                callback(err);
            });

    } catch (e) {
        logError(e.message);
        callback(e);
    }

    function log(message) {
        console.log('[' + event.request_Id + '] - ' + message);
    }

    function logError(message) {
        console.log('[' + event.request_Id + '] - Error ' + message);
    }
};

//
/*
    [Table] workflow task steps  structure.
    {                
        task_id:"", // hash key
        workflow_task_step_id:"",  // sort key      
        workflow_task_step_channel:"",        
        workflow_task_step_from:"",        
        workflow_task_step_destination:"",        
        workflow_task_step_execution_order:"",        
        workflow_task_step_execution_status:"",        
        workflow_task_step_execution_timeout:"",
        channel:"sms"
    }

*/
function saveRequest(item, callback) {

    var docClient = new AWS.DynamoDB.DocumentClient();

    var obj = {
        TableName: "table",
        Item: item
    };

    docClient.put(obj, function(err, data) {
        return callback(err, data);
    });
}