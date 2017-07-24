/*
    Entry Point..
    log results step in database (dynamodb)
*/

var AWS = require('aws-sdk');
var moment = require('moment');
var uuidv4 = require('uuid/v4');
var Promise = require("bluebird");
var request = require("request");

AWS.config.update({ 'region': 'us-east-1' });

exports.handler = function(event, context, callback) {

    var obj = {
        request_Id: uuidv4(),
        workflow_Id: 1,
        workflow_task_Id: uuidv4(),

        access_token: "bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbiI6ImNmOWU1ODU4YWZkNjc2NzI2MGI5MTY3MGQ3NTU2ZWE5MzEyODcyMWZiYzliNmMxYWQwMmUzMDQxNTk1N2FmODcwYzFkNzY1ZGY5MmVjODlmMmE3NmQ4MDkyZWZhYWFkNDY1NjkxZDRjZDFhNDIxZWZjMmU3ZjEzYzQ3MGMzZThiMzc1MWY4YmRiMjkxZWE4ODA2YjZlNDYyMmMwNGY0ZTQiLCJpYXQiOjE0ODg4MDk5NDQsImV4cCI6MTUwNDM2MTk0NH0.kuF3YpwLgljJjYEil0RlQsN8tWlo8y7rvFB0-tRiIo8",
        external_id: "SAT874578",
        destination: {
            mobile: '201000525849',
            email: 'm.samy@cequens.com'
        },
        metadata: {
            sms: {
                from: "CEQ",
                text: "your verification code is 455475",
                message_type: "Text",
                channel_timeout: '30'
            },
            voice: {
                from: "966512345985",
                text: "your verification code is 455475",
                language: "Text",
                channel_timeout: '30'
            }
        }
    };

};