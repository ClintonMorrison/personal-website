var previousQuery = "";

$(document).ready(function() {
  processInput();

	$('#query').bind('input', function() {
		var newQuery = $('#query').val();

		if (newQuery !== previousQuery) {
			processInput();
			previousQuery = newQuery;
		}
	});

	$(document).keypress(function(e) {
		if(e.which == 13) {
			processInput();
		}
	});

	$('#query').focus();
});



var processInput = _.throttle(function() {
	let query = $('#query').val();

	query = query.trim();

	// Replace "×" with "*"
	query = query.replace(/×/g, '*');

	// Remove non-number non-operator non-whitespace characters
	query = query.replace(/[^0-9\s\+\.\-\*\/^\(\)]/g, '');

	// Add "+" between each pair of numbers that only have whitespace between them
	const tokens = query.split(/\s+/);
	for (let i = 0; i < tokens.length; i++) {
		if (tokens[i]?.match(/[0-9]+/) && tokens[i + 1]?.match(/[0-9]+/)) {
			tokens[i] = tokens[i] + " +";
		}
	}
	query = tokens.join(" ");

	if ( !query || query.length === 0) {
    $('.output').hide();
	} else {
    $('.output').show();
	}

	$('#input').html(formatForDisplay(query));
	$('#result').html(getResult(query));
}, 200);



function formatForDisplay(query) {
	query = stripWhitespace(query).replace(/([^0-9a-zA-Z\(\)\[\]\^\.])/g, " $1 ");
	
	if ( query == 'NaN' || query == 'undefined' ) {
		return "Invalid input";
	}

	
	query = query.replace("/\[/g", "(");
	query = query.replace("/\]/g", ")");
	query = query.replace("/[xX]/g", "*");

	// Exponents
	query = query.replace(/([0-9a-zA-Z\(\)\[\]\.])\^([0-9a-zA-Z\(\)\[\]\.]+)/g, "$1<sup>$2</sup>");

	// Fractions
	query = query.replace(/([0-9a-zA-Z]+)([\s]*)\/([\s]*)([0-9a-zA-Z]+)/, "<sup>$1</sup>&frasl;<sub>$4</sub>");

	// Multiplication
	query = query.replace(/\*/g, "&times;");

	// Remove/replace other stuff

	return query;
}

function formatForProcessing(query) {
	query = query.replace("/\[/g", "(");
	query = query.replace("/\]/g", ")");
	query = query.replace("/[xX]/g", "*");

	query = stripWhitespace(query).replace(/([^0-9a-zA-Z\.])/g, " $1 ");
	return query;
}

function stripWhitespace(str) {
	return str.replace(/\s/g, "");
}

function getResult(query) {
	// Split into components
	var redundentTokens = formatForProcessing(query).split(' '),
		tokens = [];

	// Remove empty components
	for (var i = 0; i < redundentTokens.length; i++) {
		if (redundentTokens[i] !== '')
			tokens.push(redundentTokens[i]);
	}
	
	// Convert to postfix
	var opstack = [], 
		postfix = [];
	
	for (var i = 0; i < tokens.length; i++) {
		var t = tokens[i];

		
		if(isOperand(t))
			postfix.push(t);
		else if (t == '(')
			opstack.unshift(t);
		else if (t == ')') {
			var op = opstack.shift();
			while ( op != '('  && opstack.length > 0) {
				postfix.push(op);
				op = opstack.shift();
			}
		}
		else {
			while ( opstack.length > 0 && getOpPrec(t) <= getOpPrec(opstack[0])) {
				postfix.push(opstack.shift());
			}

			opstack.unshift(t);
		}
	}

	while (opstack.length > 0)
		postfix.push(opstack.shift());

	var result = null;

	// Evaluate postfix
	var operandStack = [];
	while (postfix.length > 0) {
		var t = postfix.shift();

		if ( isOperand(t) ) {
			operandStack.unshift(t);
		} else {
			var a = operandStack.shift(), 
				b = operandStack.shift();
			operandStack.unshift(applyOperation(b, a, t));
		}
	}
	return formatForDisplay(''+operandStack[0]);
}

function getOpPrec(op) {
	var ops = {
		'^': 4,
		'*': 3,
		'/': 3,
		'+': 2,
		'-': 2,
		'(': 1
	};
	return ops[op];
}

function isOperand(str) {
	return str.match(/[0-9a-zA-Z]+/) !== null;
}

function applyOperation(a, b, op) {
	switch (op) {
		case '+':
			return parseFloat(a) + parseFloat(b);
		case '-':
			return a-b;
		case '*':
			return a*b;
		case '/':
			return a/b;
		case '^':
			return Math.pow(a, b);
		default:
			return 'NaN';
	}
}


