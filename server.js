var moment = require('moment');
var uuidv4 = require('uuid/v4');
var express = require('express');
var bodyParser = require('body-parser');
var middleware = require('./middleware');
var controller = require('./controller');
var port = 8081;

var app = express();

// middleware
app.use(middleware.init);

app.use(middleware.uni_response);

//parse application/json and look for raw text
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

app.get("/", function(req, res) { res.json({ message: "Welcome to our discovery service!" }); });

app.route("/Cequens/api/v1/workflows/:workflowId/tasks").post(controller.startWorkflowTask);

app.route("/Cequens/api/v1/workflows/:workflowId/tasks/:taskId").get(controller.getWorkflowTaskInfo);

// Error-handling middleware
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port);

module.exports = app; // for testing