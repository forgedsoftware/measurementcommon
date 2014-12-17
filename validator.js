'use strict';

console.log('Validating systems.json...');

var JSV = require("JSV").JSV;
var systems = require('./systems.json');
var schema = require('./schema.json');

var env = JSV.createEnvironment();
var report = env.validate(systems, schema);

if (report.errors.length === 0) {
	console.log("Validation of systems.json completed sucessfully...")
} else {
	console.log("Validation of systems.json failed...");
	console.log(report.errors);
	console.log("Error Count: " + report.errors.length)
}

//console.log(report);