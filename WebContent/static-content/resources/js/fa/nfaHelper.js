cinvestav.compu.helpers = {};
cinvestav.compu.helpers.NFAHelper = {};

cinvestav.compu.helpers.NFAHelper.ENFAToNFA = function(theENFA) {

	var alphabet = theENFA.alphabet;
	var states = theENFA.states;
	var initialState = theENFA.initialState;
	var initialStateClosure = theENFA.eClosure(theENFA.initialState);
	var finalStates = theENFA.finalStates;
	var transitionMatrix = {};

	for ( var stateIndex = 0; stateIndex < finalStates.length; stateIndex++) {
		var currentState = finalStates[stateIndex];

		// if the e-closure(initial State) contains a final state
		// put the initial state in the final states
		if (initialStateClosure.indexOf(currentState) != -1 ) {
			finalStates = finalStates.concat(theENFA.initialState).unique();
			break;
		}
	}

	for ( var stateIndex = 0; stateIndex < states.length; stateIndex++) {
		var currentState = states[stateIndex];

		if (typeof (transitionMatrix[currentState]) == 'undefined') {
			transitionMatrix[currentState] = {};
		}

		for ( var symbolIndex = 0; symbolIndex < alphabet.length; symbolIndex++) {
			var currentSymbol = alphabet[symbolIndex];

			transitionMatrix[currentState][currentSymbol] = theENFA.deltaHat(currentState, currentSymbol);
		}
	}

	return new cinvestav.compu.fa.NFA(alphabet, states, transitionMatrix, initialState, finalStates);
};
