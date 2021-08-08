'use strict';

/**
 * A tool for printing out the systems in a tree form.
 */

import { readFile } from 'fs/promises';

const json = JSON.parse(await readFile(new URL('./systems.json', import.meta.url)));
const treeSystems = { descendents: [] };

unflatten();

const count = printTree(treeSystems, 0);
console.log('System Count: ' + count);

function unflatten() {
	var processedNode = false;
	for (const [systemKey, system] of Object.entries(json.systems)) {
		if (!system.processed) {
			if (system.inherits) {
				processedNode = searchDescendents(treeSystems, system, systemKey);
			} else {
				addDescendent(treeSystems, system, systemKey);
				system.processed = true;
				processedNode = true;
			}
		}
	}
	if (processedNode) {
		unflatten();
	}
}

function searchDescendents(curElement, system, systemKey) {
	var processedNode = false;
	var foundElement = curElement.descendents.find(descendent => descendent.key === system.inherits);
	if (foundElement) {
		addDescendent(foundElement, system, systemKey);
		system.processed = true;
		processedNode = true;
	} else {
		curElement.descendents.forEach(descendent => {
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
		historical: system.historical,
		descendents: []
	});
}

function printTree(tree, indent) {
	var count = 0;
	tree.descendents.forEach(descendent => {
		var historical = descendent.historical ? ' *(H)*' : '';
		console.log('  '.repeat(indent + 1) + '- ' + descendent.key + ' (' + descendent.name + ')' + historical);
		count += 1 + printTree(descendent, indent + 1);
	});
	return count;
}
