cinvestav.compu.fa.FA = function(alphabet, states, transitionMatrix, initialState, finalStates) {
	this.alphabet = alphabet;
	this.states = states;
	this.transitionMatrix = transitionMatrix;
	this.initialState = initialState;
	this.finalStates = finalStates;
	this.symbolMaxLength = cinvestav.compu.utils.findSymbolMaxLength(this.alphabet);
};

cinvestav.compu.fa.NFA = function(alphabet, states, transitionMatrix, initialState, finalStates) {
	cinvestav.compu.fa.FA.call(this, alphabet, states, transitionMatrix, initialState, finalStates);

	this.itemToArray = function(theElement) {
		var result;

		if (typeof (theElement) == 'string') {
			result = [ theElement ];
		} else {
			result = theElement;
		}

		return result;
	};

	this.wordToArray = function(word) {

		if (typeof (word) == "string") {
			// if some of the symbols has more than one character, we expect
			// a comma separated string
			word = (this.symbolMaxLength > 1) ? word.split(",") : word.split("");
		}

		return word;
	};

	this.delta = function(states, symbol) {
		states = this.itemToArray(states);
		var result = [], stateResult;

		for ( var stateIndex = 0; stateIndex < states.length; stateIndex++) {

			var currentState = states[stateIndex];
			stateResult = (symbol == "" || symbol == cinvestav.compu.constants.TOKEN_EPSILON) ? currentState : this.transitionMatrix[currentState][symbol];

			if (stateResult != null) { // an empty set should be an empty array
				// or null value
				result = result.concat(stateResult);
			}
		}

		return result.unique();
	};

	this.deltaWord = function(state, word) {
		word = this.wordToArray(word);
		var result;
		// word = wordX + symbolA

		if (word.length == 0) {
			result = this.delta(state, "");
		} else {

			var wordX = (word.length > 1) ? word.slice(0, word.length - 1) : "";
			var aSymbol = (word.length > 1) ? word.slice(word.length - 1) : word;
			aSymbol = aSymbol[0];
			result = this.delta(this.deltaWord(state, wordX), aSymbol);
		}

		return result;
	};

	this.transitionMatrixToString = function() {
		var theString = "";

		for ( var stateIndex = 0; stateIndex < this.states.length; stateIndex++) {
			var currentState = this.states[stateIndex];

			for ( var symbolIndex = 0; symbolIndex < this.alphabet.length; symbolIndex++) {
				var currentSymbol = this.alphabet[symbolIndex];

				theString = theString + "transitionMatrix[" + stateIndex + "][" + symbolIndex + "]=";
				theString = theString + cinvestav.compu.utils.arrayToString(this.transitionMatrix[currentState][currentSymbol],",") + "&";
			}
		}

		return theString;
	};

};

cinvestav.compu.fa.NFA.prototype = cinvestav.compu.fa.FA.prototype;

// DEFINIR TRANSITION MATRIX PARA INCLUIR delta(q0,eps) = q0 ??
cinvestav.compu.fa.ENFA = function(alphabet, states, transitionMatrix, initialState, finalStates) {
	cinvestav.compu.fa.NFA.call(this, alphabet, states, transitionMatrix, initialState, finalStates);

	this.eClosure = function(states) {
		states = this.itemToArray(states);
		var result = [];
		for ( var stateIndex = 0; stateIndex < states.length; stateIndex++) {
			result = result.concat(this.eClosureOneState(states[stateIndex]));
		}

		return result.unique();
	};

	this.eClosureOneState = function(state, processedStates) {

		var finalTransitions = [ state ];// it should never be null
		var transitions = this.transitionMatrix[state][cinvestav.compu.constants.TOKEN_EPSILON];

		if (typeof (processedStates) == 'undefined') {
			processedStates = [ state ];
		} else {
			processedStates = processedStates.concat([ state ]);
		}

		if (transitions != null && typeof (transitions) == 'string') {
			finalTransitions = finalTransitions.concat([ transitions ]);
		} else {
			finalTransitions = finalTransitions.concat(transitions);
		}

		for ( var stateIndex = 0; stateIndex < finalTransitions.length; stateIndex++) {
			var currentState = finalTransitions[stateIndex];

			if (processedStates.indexOf(currentState) == -1) {
				finalTransitions = finalTransitions.concat(this.eClosureOneState(currentState, processedStates)).unique();
			}
		}

		return finalTransitions.unique();
	};

	this.delta = function(states, symbol) {
		states = this.itemToArray(states);
		var result = [];

		for ( var stateIndex = 0; stateIndex < states.length; stateIndex++) {

			symbol = (symbol == "") ? cinvestav.compu.constants.TOKEN_EPSILON : symbol;
			var stateResult = this.transitionMatrix[states[stateIndex]][symbol];
			if (stateResult != null) { // empty set union set = set
				result = result.concat(stateResult);
			}
		}

		return result.unique();
	};

	this.deltaHat = function(states, word) {
		var result;

		word = this.wordToArray(word);

		if (word.length == 0) {
			result = this.eClosure(states);
		} else {
			// w = xa
			var wordX = (word.length > 1) ? word.slice(0, word.length - 1) : "";
			var aSymbol = (word.length > 1) ? word.slice(word.length - 1) : word;
			aSymbol = aSymbol[0];
			result = this.eClosure(this.delta(this.deltaHat(states, wordX), aSymbol));
		}

		return result;
	};
};

cinvestav.compu.fa.ENFA.prototype = cinvestav.compu.fa.NFA.prototype;
