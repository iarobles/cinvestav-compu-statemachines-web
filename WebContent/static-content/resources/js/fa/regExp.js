cinvestav.compu.utils.RegExp = function(theRegExp, theAlphabet) {
	this.alphabet = theAlphabet;
	this.regExp = theRegExp;
	this.totalStates = 0;

	// some useful regular expressions
	var aWord = cinvestav.compu.utils.arrayToString(this.alphabet, "|");
	var aCompleteWord = cinvestav.compu.utils.arrayToString(this.alphabet, "|") + "|" + cinvestav.compu.constants.TOKEN_EPSILON + "|" + cinvestav.compu.constants.TOKEN_EMPTY_SET;
	var alphabetRegExp = new RegExp("^(" + aWord + ")");
	var concatenationSymbol = "M";// "_CNCA_";
	var binaryOperatorsRegExp = new RegExp("^(\\+|" + concatenationSymbol + ")");

	var symbolSymbolRegExp = new RegExp("(" + aCompleteWord + ")(" + aCompleteWord + ")", "g");
	// symbol(
	var symbolLeftP = new RegExp("(" + aCompleteWord + ")\\(", "g");

	// )symbol
	var rigthPSymbol = new RegExp("\\)(" + aCompleteWord + ")", "g");

	var epsilonRegExp = new RegExp("^(" + cinvestav.compu.constants.TOKEN_EPSILON + ")");

	var starSymbol = new RegExp("\\*(" + aCompleteWord + ")", "g");
	var leftPRegExp = new RegExp("^\\(");
	var kleenClosureRegExp = new RegExp("^\\*");

	// operator weights
	var operatorWeight = [ [ "+", 1 ], [ concatenationSymbol, 2 ] ];

	this.symbolToENFA = function(symbol) {
		var initialState = "q" + (this.totalStates + 1);
		var finalState = "q" + (this.totalStates + 2);
		var states = [ initialState, finalState ];
		var finalStates = [ finalState ];
		var transitionMatrix = {};
		transitionMatrix[initialState] = {};
		transitionMatrix[finalState] = {};

		for ( var alphabetIndex = 0; alphabetIndex < this.alphabet.length; alphabetIndex++) {
			var currentSymbol = this.alphabet[alphabetIndex];
			transitionMatrix[initialState][currentSymbol] = (currentSymbol == symbol) ? finalState : []; // EMPTY
			transitionMatrix[finalState][currentSymbol] = [];
		}

		transitionMatrix[initialState][cinvestav.compu.constants.TOKEN_EPSILON] = [];// initialState;
		transitionMatrix[finalState][cinvestav.compu.constants.TOKEN_EPSILON] = [];// finalState;

		var theENFA = new cinvestav.compu.fa.ENFA(this.alphabet, states, transitionMatrix, initialState, finalStates);
		this.totalStates = this.totalStates + 2;// add two new states

		return theENFA;
	};

	this.joinTransitionMatrix = function(transitionMatrix, theENFA1) {
		// join with enfa1
		var theAlphabet = theENFA1.alphabet.concat([ cinvestav.compu.constants.TOKEN_EPSILON ]);

		for ( var stateIndex = 0; stateIndex < theENFA1.states.length; stateIndex++) {
			var currentState = theENFA1.states[stateIndex];
			for ( var alphabetIndex = 0; alphabetIndex < theAlphabet.length; alphabetIndex++) {
				var currentSymbol = theAlphabet[alphabetIndex];

				if (typeof (transitionMatrix[currentState]) == 'undefined') {
					transitionMatrix[currentState] = {};
				}

				transitionMatrix[currentState][currentSymbol] = theENFA1.transitionMatrix[currentState][currentSymbol];
			}
		}

	};

	this.makeUnion = function(theENFA1, theENFA2) {
		var initialState = "q" + (this.totalStates + 1);
		var finalState = "q" + (this.totalStates + 2);
		var states = [ initialState, finalState ];
		states = states.concat(theENFA1.states).concat(theENFA2.states);
		var finalStates = [ finalState ];
		var transitionMatrix = {};

		transitionMatrix[initialState] = {};
		transitionMatrix[finalState] = {};
		// set delta(q0,a) = empty
		for ( var alphabetIndex = 0; alphabetIndex < this.alphabet.length; alphabetIndex++) {
			var currentSymbol = this.alphabet[alphabetIndex];
			transitionMatrix[initialState][currentSymbol] = [];
			transitionMatrix[finalState][currentSymbol] = [];
		}
		// set delta(q0,eps) = {enfa.initialState, enfa2.initialState}
		transitionMatrix[initialState][cinvestav.compu.constants.TOKEN_EPSILON] = [ /* initialState, */theENFA1.initialState, theENFA2.initialState ];

		// set delta(qf,eps) = qf
		transitionMatrix[finalState][cinvestav.compu.constants.TOKEN_EPSILON] = [];/*
																					 * [
																					 * finalState ]
																					 */

		// join with enfa1
		this.joinTransitionMatrix(transitionMatrix, theENFA1);
		transitionMatrix[theENFA1.finalStates[0]][cinvestav.compu.constants.TOKEN_EPSILON] = [ /* theENFA1.finalStates[0], */finalState ];

		// join with enfa2
		this.joinTransitionMatrix(transitionMatrix, theENFA2);
		transitionMatrix[theENFA2.finalStates[0]][cinvestav.compu.constants.TOKEN_EPSILON] = [ /* theENFA2.finalStates[0], */finalState ];

		var theENFA = new cinvestav.compu.fa.ENFA(this.alphabet, states, transitionMatrix, initialState, finalStates);
		this.totalStates = this.totalStates + 2;

		return theENFA;
	};

	this.makeConcatenation = function(theENFA1, theENFA2) {
		var initialState = theENFA1.initialState;
		var finalState = theENFA2.finalStates[0];
		var states = theENFA1.states.concat(theENFA2.states);
		var finalStates = [ finalState ];
		var transitionMatrix = {};

		this.joinTransitionMatrix(transitionMatrix, theENFA1);
		this.joinTransitionMatrix(transitionMatrix, theENFA2);

		transitionMatrix[theENFA1.finalStates[0]][cinvestav.compu.constants.TOKEN_EPSILON] = [ theENFA2.initialState ];

		var theENFA = new cinvestav.compu.fa.ENFA(this.alphabet, states, transitionMatrix, initialState, finalStates);

		return theENFA;
	};

	this.epsToENFA = function() {
		var initialState = "q" + (this.totalStates + 1);
		var finalState = initialState;
		var states = [ initialState ];
		var finalStates = [ finalState ];
		var transitionMatrix = {};
		transitionMatrix[initialState] = {};

		for ( var alphabetIndex = 0; alphabetIndex < this.alphabet.length; alphabetIndex++) {
			var currentSymbol = this.alphabet[alphabetIndex];
			transitionMatrix[initialState][currentSymbol] = []; // EMPTY
		}

		transitionMatrix[initialState][cinvestav.compu.constants.TOKEN_EPSILON] = [];// initialState;

		var theENFA = new cinvestav.compu.fa.ENFA(this.alphabet, states, transitionMatrix, initialState, finalStates);
		this.totalStates = this.totalStates + 1;// add two new states

		return theENFA;
	};

	this.makeKleeneClosure = function(theENFA) {

		var initialState = "q" + (this.totalStates + 1);
		var finalState = "q" + (this.totalStates + 2);
		var states = [ initialState, finalState ];
		states = states.concat(theENFA.states);
		var finalStates = [ finalState ];
		var transitionMatrix = {};

		transitionMatrix[initialState] = {};
		transitionMatrix[finalState] = {};
		// set delta(q0,a) = empty
		for ( var alphabetIndex = 0; alphabetIndex < this.alphabet.length; alphabetIndex++) {
			var currentSymbol = this.alphabet[alphabetIndex];
			transitionMatrix[initialState][currentSymbol] = [];
			transitionMatrix[finalState][currentSymbol] = [];
		}

		// set delta(q0,eps) = {enfa.q0, qf}
		transitionMatrix[initialState][cinvestav.compu.constants.TOKEN_EPSILON] = [ theENFA.initialState, finalState ];

		// set delta(qf) = []
		transitionMatrix[finalState][cinvestav.compu.constants.TOKEN_EPSILON] = [];

		this.joinTransitionMatrix(transitionMatrix, theENFA);

		var transitions = transitionMatrix[theENFA.finalStates[0]][cinvestav.compu.constants.TOKEN_EPSILON];
		// transitions always has only one element, it will not be correct to
		// use [transtions] if transitions is an array
		transitions = transitions.concat([ theENFA.initialState, finalState ]);
		transitionMatrix[theENFA.finalStates[0]][cinvestav.compu.constants.TOKEN_EPSILON] = transitions;

		this.totalStates = this.totalStates + 2;

		return new cinvestav.compu.fa.ENFA(this.alphabet, states, transitionMatrix, initialState, finalStates);
	};

	this.hasBalancedParentheses = function(theString) {
		var isBalanced = true;

		var lPCount = theString.match(/\(/g);
		var rPCount = theString.match(/\)/g);
		lPCount = (lPCount == null) ? 0 : lPCount.length;
		rPCount = (rPCount == null) ? 0 : rPCount.length;

		if (lPCount == rPCount) {

			for ( var prefixLength = 1; prefixLength <= theString.length; prefixLength++) {
				var substring = theString.substring(0, prefixLength);

				var lPCount = theString.match(/\(/g);
				var rPCount = theString.match(/\)/g);
				lPCount = (lPCount == null) ? 0 : lPCount.length;
				rPCount = (rPCount == null) ? 0 : rPCount.length;

				if (lPCount < rPCount) {
					isBalanced = false;
					break;
				}
			}

		} else {
			isBalanced = false;
		}

		return isBalanced;
	};

	this.getFirstBalancedString = function(theString) {
		var theBalancedString = null;
		for ( var prefixLength = 1; prefixLength <= theString.length; prefixLength++) {
			var substring = theString.substring(0, prefixLength);
			if (this.hasBalancedParentheses(substring)) {
				theBalancedString = substring;
				break;
			}
		}

		return theBalancedString;
	};

	this.getOperatorWeight = function(theOperator) {
		return operatorWeight[theOperator];
	};

	// reduces enfa1 operation enfa2 to enfa3 and updates the operation stack
	this.reduceBinaryOperation = function(operationStack) {

		var rigthTerm = operationStack.pop();// last item
		var leftTerm = operationStack.pop();
		var theENFA2 = rigthTerm[0];
		var theENFA1 = leftTerm[0];
		var operation = leftTerm[1];
		var finalENFA = null;

		if (operation == "+") {
			finalENFA = this.makeUnion(theENFA1, theENFA2);
		} else { // CONCATENATION
			finalENFA = this.makeConcatenation(theENFA1, theENFA2);
		}

		return operationStack.push([ finalENFA, rigthTerm[1] ]);// not necessary
	};

	/**
	 * 
	 */
	this.toENFA = function(theExpression) {

		if (typeof (theExpression) == 'undefined') {
			var theExpression = this.regExp.replace(symbolSymbolRegExp, "$1" + concatenationSymbol + "$2").replace(symbolSymbolRegExp, "$1" + concatenationSymbol + "$2");

			theExpression = theExpression.replace(symbolLeftP, "$1" + concatenationSymbol + "(").replace(symbolLeftP, "$1" + concatenationSymbol + "(");
			theExpression = theExpression.replace(rigthPSymbol, ")" + concatenationSymbol + "$1").replace(rigthPSymbol, ")" + concatenationSymbol + "$1");
			theExpression = theExpression.replace(starSymbol, "*" + concatenationSymbol + "$1");
			theExpression = theExpression.replace(")(", ")" + concatenationSymbol + "(");
			theExpression = theExpression.replace("*(", "*" + concatenationSymbol + "(");

			this.totalStates = 0;
		}

		var currentItem = null;
		var operationStack = [];
		var lastOperatorWeight = -1;

		while (theExpression != "") {

			// test for symbols
			if ((matcher = alphabetRegExp.exec(theExpression)) != null) {
				var theENFA = this.symbolToENFA(matcher[0]);

				currentItem = [ theENFA, null ];
				// console.debug("SYMBOL:" + matcher[0]);
				operationStack.push(currentItem);

				// update the expression
				theExpression = theExpression.substring(matcher[0].length, theExpression.length);
			} else if ((matcher = binaryOperatorsRegExp.exec(theExpression)) != null) {

				if (this.getOperatorWeight(matcher[0]) <= lastOperatorWeight) {
					this.reduceBinaryOperation(operationStack);
				} else {
					currentItem[1] = matcher[0];
					// console.debug("OPERATOR:" + matcher[0]);
				}

				// update the expression
				theExpression = theExpression.substring(matcher[0].length, theExpression.length);

			} else if ((matcher = leftPRegExp.exec(theExpression)) != null) {

				// get the first inner balanced parentheses (reluctant aproach)
				var innerExpression = this.getFirstBalancedString(theExpression);
				// update the Expression
				theExpression = theExpression.substring(innerExpression.length);

				// process the inner expression
				innerExpression = innerExpression.substring(1, innerExpression.length - 1);
				// create a new item
				currentItem = [ this.toENFA(innerExpression), null ];
				operationStack.push(currentItem);

			} else if ((matcher = kleenClosureRegExp.exec(theExpression)) != null) {

				// update the expression
				theExpression = theExpression.substring(1, theExpression.length);
				currentItem[0] = this.makeKleeneClosure(currentItem[0]);
			} else if ((matcher = epsilonRegExp.exec(theExpression)) != null) {
				var theENFA = this.epsToENFA();

				currentItem = [ theENFA, null ];
				// console.debug("SYMBOL:" + matcher[0]);
				operationStack.push(currentItem);

				// update the expression
				theExpression = theExpression.substring(matcher[0].length, theExpression.length);
			} else {

				throw "La cadena:" + theExpression + " no es valida para el alfabeto:" + this.alphabet;
			}

		}

		while (operationStack.length > 1) {
			this.reduceBinaryOperation(operationStack);
		}

		return operationStack[0][0];
	};

};
