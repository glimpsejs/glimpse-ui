'use strict';

require('./app.scss');
require('./app.js');
var ace = require('brace');
require('brace/mode/javascript');
require('brace/ext/beautify');

var Interpreter = require('../node_modules/jsinterpreter/interpreter.js');
var interpreter = null;

var timeout = null;
var editor = null;
var session = null;
var selection = null;

var elements = {
	output : null,
	step: null,
	run: null,
	pause: null,
	reset: null,
	timeout: null,
	timeoutLabel: null,
	loading: null,
	seekpos: null,
	seekstart: null,
	seekend: null,
	stepback: null
};

window.addEventListener('DOMContentLoaded', init);

function init() {
	console.info('init()');

	elements.loading = document.querySelector('#output').innerHTML;
	elements.output = document.querySelector('#output');
	elements.step = document.querySelector('#step');
	elements.run = document.querySelector('#run');
	elements.pause = document.querySelector('#pause');
	elements.reset = document.querySelector('#reset');
	elements.timeout = document.querySelector('#timeout');
	elements.timeoutLabel = document.querySelector('#timeoutLabel');
	elements.seekpos = document.querySelector('#seekpos');
	elements.seekstart = document.querySelector('#seekstart');
	elements.seekend = document.querySelector('#seekend');
	elements.stepback = document.querySelector('#stepback');

	elements.run.addEventListener('click', run);
	elements.step.addEventListener('click', step);
	elements.pause.addEventListener('click', clear);
	elements.reset.addEventListener('click', reset);
	elements.timeout.addEventListener('input', setTimeoutRange);


	elements.seekstart.addEventListener('click', seekStart);
	elements.seekend.addEventListener('click', seekEnd);
	elements.stepback.addEventListener('click', stepBack);


	elements.output.textContent = elements.output.textContent.trim();
	setTimeoutRange();
	initEditor();
}

function seekStart() {
	clear();
	interpreter.seek = 0;
	drawSeek();
}

function stepBack() {
	clear();
	interpreter.seek--;
	drawSeek();
}

function seekEnd() {
	clear();
	interpreter.seek = interpreter.history.length-1;
	drawSeek();
}

function run() {
	console.info('run');
	if (!(interpreter instanceof Interpreter)) {
		interpreter = new Interpreter(editor.getValue());
	}
	window.interpreter = interpreter;
	timeout = setTimeout(evaluated, elements.timeout.value);
	console.info(interpreter.getScope());
	window.localStorage.setItem('editor', editor.getValue());
}

function step() {
	console.info('step()');

	var node;
	if (!(interpreter instanceof Interpreter)) {
		interpreter = new Interpreter(editor.getValue());
	}
	if (interpreter.stateStack[0]) {
		node = interpreter.stateStack[0].node;
	}
	console.info(node);
	evaluate();
}

function evaluate() {
	if(interpreter.seek == interpreter.history.length) {
		return evaluateStep();
	}else{
		return evaluateSeek();
	}
}

function drawSeek() {
	var stepState = interpreter.history[interpreter.seek];
	var html = drawScope(stepState);
	var range = stepState.selectionRange;
	selectRange(range);
	elements.seekpos.innerHTML = interpreter.seek;
	elements.output.innerHTML = html;
}

function evaluateSeek() {
	interpreter.seek++;
	drawSeek();
	if(interpreter.stateStack.length == 0 && interpreter.seek === interpreter.history.length) {
		return false
	}
	return true;
}

function evaluateStep() {
	var start, end, html, node;
	if (interpreter.step()) {
		if (interpreter.stateStack[0]) {
			node = interpreter.stateStack[0].node;
			start = node.start;
			end = node.end;
		} else {
			start = 0;
			end = 0;
		}
		var range = createSelection(start, end);
		var scopeState = interpreter.visualizeScope();
		scopeState.selectionRange = range;
		interpreter.history.push(scopeState)
		html = drawScope(scopeState);
		interpreter.seek++;
		elements.seekpos.innerHTML = interpreter.seek;
		elements.output.innerHTML = html;
		return true;
	}else{
		drawSeek();
		return false;
	}
}

function evaluated(callback) {
	console.info('evaluated()');
	if(evaluate()) {
		timeout = setTimeout(evaluated, elements.timeout.value);
	}
}

function reset() {
	console.warn('reset()');
	clear();
	elements.output.textContent = '';
	elements.output.innerHTML = elements.loading;
	elements.step.disabled = false;
	elements.seekpos.innerHTML = interpreter.seek;
	interpreter = new Interpreter(editor.getValue());
}

function clear() {
	console.warn('clear()');
	clearTimeout(timeout);
}

function setTimeoutRange(e) {
	e = e || { target: elements.timeout };
	elements.timeoutLabel.textContent = e.target.value;
}

function initEditor() {
	editor = ace.edit('editor');

	session = editor.getSession();
	session.setMode('ace/mode/javascript');
	selection = session.getSelection();

	editor.setOptions({
		enableBasicAutocompletion: true,
		enableLiveAutocompletion: false,
		enableSnippets: true
	});
	editor.commands.addCommands('ace/ext/beautify');
	editor.setValue((window.localStorage.getItem('editor') || ''));
}


function print(obj, indentation) {
	if(typeof obj === "string") {
		return '"' + obj + '"';
	}else if(obj instanceof RegExp) {
		return obj.toString();
	}else if(typeof obj !== 'object') {
		return obj
	}else if(obj === null) {
		return "" + obj;
	}else if(obj.type === 'function') {
		var result = obj.funcText.split("\n");
		result[0] = result[0] + " //created in scope " + obj.createdIn;
		return result.join("\n");
	}else if(Array.isArray(obj)) {
		var result = "[";
		for(var i = 0; i < obj.length; i++) {
			if(i == 0) {
				result += print(obj[i]);
			}else{
				result += ", " + print(obj[i]);
			}
		}
		result+="]";
		return result;
	}else if(obj.type == 'object') {
		return printObj(obj, indentation);
	}
}

function printObj(obj, indentation) {
	indentation = indentation || "  ";
	var result = "";
	if(obj.constructor !== 'object') {
		result += obj.constructor + " ";
	}
	result += "{\n";
	for(var prop in obj.properties) {
		result += indentation + prop + ": " + print(obj.properties[prop], "  "+indentation)+"\n";
	}
	result += indentation.slice(2) + "}\n";
	return result;
}

function drawScope(scope) {
	var result = "<fieldset class='scope-container'><legend>" + scope.name + "</legend>";
	var propertyStr = "";
	for(var prop in scope.properties) {
		propertyStr += prop + " = " + print(scope.properties[prop]) + "\n";
	}
	result +="<pre class='function-output'>" + propertyStr + "</pre>";
	for(var i = 0; i < scope.closures.length; i++) {
		result += drawScope(scope.closures[i]);
	}
	for(var i = 0; i < scope.child_scopes.length; i++) {
		result += drawScope(scope.child_scopes[i]);
	}
	result += "</fieldset>"
	return result;
}

function createSelection(start, end) {
	var range = Range(editor.getValue(), start, end);
	selection.setSelectionRange(range);
	return range;
}

function selectRange(range) {
	selection.setSelectionRange(range);
}

function Range(text, start, end) {
	console.warn('start: %d, end: %d', start, end);
	var textArray = text.split('\n'),
		selectStart = {
			row: 0,
			column: 0
		},
		selectEnd = {
			row: 0,
			column: 0
		},
		columnCount = 0,
		rowCount = 0;

	for (rowCount = 0; columnCount < start; rowCount++) {
		columnCount += textArray[rowCount].length + 1;
	}
	selectStart.row = rowCount - 1;
	try {
		selectStart.column = (start - (columnCount - (textArray[rowCount - 1].length + 1)));
	} catch (e) {
		console.error(e);
	}

	for (; columnCount < end; rowCount++) {
		columnCount += textArray[rowCount].length + 1;
	}
	selectEnd.row = rowCount - 1;
	selectEnd.column = (end - (columnCount - (textArray[rowCount - 1].length + 1)));
	return {start: selectStart, end: selectEnd};
}
