'use strict';

/**
 * A tool to validate systems.json.
 */

import { readFile } from 'fs/promises';
import { JSV } from 'JSV'

console.log('Validating systems.json...');

const schema = JSON.parse(await readFile(new URL('./schema.json', import.meta.url)));
const json = JSON.parse(await readFile(new URL('./systems.json', import.meta.url)));

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

function validateAgainstSchema() {
	var env = JSV.createEnvironment();
	var report = env.validate(json, schema);
	return report.errors;
}

function validateMeasurementSystemInherits() {
	var errors = [];
	var systemKeys = Object.keys(json.systems);
	for (const [key, system] of Object.entries(json.systems)) {
		if (system.inherits) {
			if (!systemKeys.includes(system.inherits)) {
				errors.push('system \'' + key + '\' inherits from unknown system \'' + system.inherits + '\'');
			}
			if (key === system.inherits) {
				errors.push('system \'' + key + '\' should not inherit from itself');
			}
		}
	};
	return errors;
}

function validateBaseUnits() {
	var errors = [];
	for (const [key, dimension] of Object.entries(json.dimensions)) {
		var unitKeys = Object.keys(dimension.units);
		if (dimension.inheritedUnits) {
			unitKeys = [...unitKeys, ...Object.keys(json.dimensions[dimension.inheritedUnits].units)];
		}
		if (!unitKeys.includes(dimension.baseUnit)) {
			errors.push('dimension \'' + key + '\' has a baseUnit \'' + dimension.baseUnit + '\' that does not match any know unit');
		}
	}
	return errors;
}

function validateUnitSystems() {
	var errors = [];
	var systemKeys = Object.keys(json.systems);
	for (const [dimKey, dimension] of Object.entries(json.dimensions)) {
		for (const [unitKey, unit] of Object.entries(dimension.units)) {
			for (const system of Object.values(unit.systems)) {
				if (!systemKeys.includes(system)) {
					errors.push('unknown system \'' + system + '\' in ' + dimKey + ':' + unitKey);
				}
			}
		}
	}
	return errors;
}

function validateDerived() {
	var errors = [];
	// Can only be derived from base dimensions
	var baseDimensionKeys = Object.entries(json.dimensions)
		.filter(([, value]) => !value.derived)
		.map(([key]) => key);
		
	for (const [dimensionKey, dimension] of Object.entries(json.dimensions)) {
		if (dimension.derived && dimension.derived.length > 0) {
			var parts = dimension.derived.split(/([/*|/])/);
			parts.forEach((part, position) => {
				if (position % 2 === 1 && !(part === '*' || part === '/')) {
					errors.push('unknown operation \'' + part + '\' used in dimension.derived for ' + dimensionKey);
				}
				if (position % 2 === 0 && !(baseDimensionKeys.includes(part) || part === '1')) {
					errors.push('unknown base dimension or placeholder \'' + part + '\' used in dimension.derived for ' + dimensionKey);
				}
			});
		}
	}
	return errors;
}
