'use strict';

/**
 * A tool to validate systems.json.
 */

console.log('Validating systems.json...');

var JSV = require("JSV").JSV,
	fs = require("fs"),
	JSON2 = require('JSON2'),
	_ = require("lodash"),
	systems = require('./systems.json'),
	schema = require('./schema.json');

doValidate('Strict Parse', validateParse);
doValidate('JSON Schema', validateAgainstSchema);
doValidate('MeasurementSystems Inherits', validateMeasurementSystemInherits);
doValidate('Systems BaseUnit', validateBaseUnits);
doValidate('Systems Derived', validateDerived);
doValidate('Systems UnitMeasurementSystems', validateUnitSystems);

console.log('Validating systems.json succeeded!');

// HELPER FUNCTIONS

function doValidate(sectionName, func) {
	var errors = func();
	if (errors.length === 0) {
		console.log(' - ' + sectionName + ': succeeded');
	} else {
		console.log(' - ' + sectionName + ': failed');
		printErrors(errors);
		process.exit(1);
	}
}

function printErrors(errors) {
	if (errors.length > 5) {
		console.log("Showing first 5 errors only.");
	}
	console.log(errors.slice(0, 5));
	console.log("Error Count: " + errors.length);
}

// VALIDATION

function validateParse() {
	// Don't catch the errors here to preserve details
	JSON2.parse(fs.readFileSync("./systems.json", "utf8"));
	return [];
}

function validateAgainstSchema() {
	var env = JSV.createEnvironment();
	var report = env.validate(systems, schema);
	return report.errors;
}

function validateMeasurementSystemInherits() {
	var errors = [];
	var systemKeys = _.keys(systems.systems);
	_.each(systems.systems, function (system, key) {
		if (system.inherits !== undefined) {
			if (!_.includes(systemKeys, system.inherits)) {
				errors.push('system \'' + key + '\' inherits from unknown system \'' + system.inherits + '\'');
			}
			if (key === system.inherits) {
				errors.push('system \'' + key + '\' should not inherit from itself');
			}
		}
	});
	return errors;
}

function validateBaseUnits() {
	var errors = [];
	_.each(systems.dimensions, function (dimension, key) {
		var unitKeys = _.keys(dimension.units);
		if (dimension.inheritedUnits) {
			unitKeys = _.union(unitKeys, _.keys(systems.dimensions[dimension.inheritedUnits].units));
		}
		if(!_.includes(unitKeys, dimension.baseUnit)) {
			errors.push('dimension \'' + key + '\' has a baseUnit \'' + dimension.baseUnit + '\' that does not match any know unit');
		}
	});
	return errors;
}

function validateUnitSystems() {
	var errors = [];
	var systemKeys = _.keys(systems.systems);
	_.each(systems.dimensions, function (dimension, dimKey) {
		_.each(dimension.units, function (unit, unitKey) {
			_.each(unit.systems, function (system) {
				if (!_.includes(systemKeys, system)) {
					errors.push('unknown system \'' + system + '\' in ' + dimKey + ':' + unitKey);
				}
			});
		});
	});
	return errors;
}

function validateDerived() {
	var errors = [];
	// Can only be derived from base dimensions
	var baseDimensionKeys = _.keys(_.pickBy(systems.dimensions, dim => !dim.derived));
	
	_.each(systems.dimensions, function (dimension, dimensionKey) {
		if (dimension.derived && dimension.derived.length > 0) {
			var parts = dimension.derived.split(/([/*|/])/);
			_.each(parts, function (part, position) {
				if (position % 2 === 1 && !(part === '*' || part === '/')) {
					errors.push('unknown operation \'' + part + '\' used in dimension.derived for ' + dimensionKey);
				}
				if (position % 2 === 0 && !(_.includes(baseDimensionKeys, part) || part === '1')) {
					errors.push('unknown base dimension or placeholder \'' + part + '\' used in dimension.derived for ' + dimensionKey);
				}
			})
		}
	});
	return errors;
}
