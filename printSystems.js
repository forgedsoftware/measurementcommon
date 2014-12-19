'use strict';

/**
 * A tool for printing out the systems in a tree form.
 */

var _ = require("lodash"),
	systems = require('./systems.json');

var treeSystems = { descendents: [] };

(function printSystems() {
	_.each(systems.systems, function (system) {
		system.processed = false;
	});

	unflatten();
	var count = printTree(treeSystems, 0);
	console.log('System Count: ' + count);
})();

function unflatten() {
	var processedNode = false;
	_.each(systems.systems, function (system, systemKey) {
		if (!system.processed) {
			if (system.inherits) {
				processedNode = searchDescendents(treeSystems, system, systemKey);
			} else {
				addDescendent(treeSystems, system, systemKey);
				system.processed = true;
				processedNode = true;
			}
		}
	});
	if (processedNode) {
		unflatten();
	}
}

function searchDescendents(curElement, system, systemKey) {
	var processedNode = false;
	var foundElement = _.find(curElement.descendents, { 'key': system.inherits });
	if (foundElement) {
		addDescendent(foundElement, system, systemKey);
		system.processed = true;
		processedNode = true;
	} else {
		_.each(curElement.descendents, function (descendent) {
			if (!processedNode) {
				processedNode = searchDescendents(descendent, system, systemKey);
			}
		});
	}
	return processedNode;
}

function addDescendent(element, system, systemKey) {
	element.descendents.push({
		name: system.name,
		key: systemKey,
		descendents: []
	});
}

function printTree(tree, indent) {
	var count = 0;
	_.each(tree.descendents, function (descendent) {
		console.log(repeat('    ', indent) + '=> ' + descendent.key + ' (' + descendent.name + ')');
		count += 1 + printTree(descendent, indent + 1);
	});
	return count;
}

function repeat(s, n) {
    var a = [];
    while (a.length < n) {
        a.push(s);
    }
    return a.join('');
}