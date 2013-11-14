(function() {
	var alphabet = [ '0', '1' ];
	var states = [ 'q1', 'q2', 'q3' ];
	var transitionMatrix = {};

	transitionMatrix['q1'] = [];
	transitionMatrix['q1']['0'] = 'q2';
	transitionMatrix['q1']['1'] = 'q3';

	transitionMatrix['q2'] = [];
	transitionMatrix['q2']['0'] = 'q1';
	transitionMatrix['q2']['1'] = 'q3';

	transitionMatrix['q3'] = [];
	transitionMatrix['q3']['0'] = 'q2';
	transitionMatrix['q3']['1'] = 'q2';

	var initialState = 'q1';
	var finalStates = [ 'q2', 'q3' ];
	var acceptString = [ '01', '11', '11', '01' ];
	var notValidString = [ '01', '11' ];

	var dfa = new cinvestav.compu.fa.DFA(alphabet, states, transitionMatrix, initialState, finalStates);

	// console.debug("--- test for reg exp---");
	var i = 1;
	var j = 1;
	var k = states.length;
	for (i = 0; i < states.length; i++) {
		for (j = 0; j < states.length; j++) {
			for (k = -1; k < states.length - 1; k++) {
				console.debug("R[" + (i + 1) + "][" + (j + 1) + "]_" + (k + 1) + "=" + dfa.toRegExp(i, j, k));
			}
		}
	}

	// console.debug("3,1,1:" + dfa.toRegExp(0, 0, states.length - 1, true));
	// console.debug(dfa.simplify("EMPTY0+0+1(00+EPS)*(EPS+00)*0+0+EMPTYEPS+EMPTY"));
	// console.debug(dfa.isAcceptable(""));
	// console.debug(dfa.isAcceptable(acceptString));
	// console.debug(dfa.isAcceptable("01,11,11,01"));
	// console.debug(dfa.isAcceptable(notValidString));
	try {
		// dfa.isAcceptable("0a");
		console.debug(dfa.equivalentRegExp(true));
	} catch (ex) {
		console.debug(ex);
	}

})();
