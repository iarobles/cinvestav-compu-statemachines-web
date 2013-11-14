// console.debug(regularExp.toENFA());

$(function() {
	var regularExp = new cinvestav.compu.utils.RegExp("EPS", [ "0", "11", "2" ]);
	var enfa = regularExp.toENFA();
	// console.debug(enfa);
	// cinvestav.compu.drawENFA("box-container", enfa);
	// cinvestav.compu.drawFATransitionMatrix("#box-container", enfa);
});

/* ----- test ---- */

(function() {
	var eps = cinvestav.compu.constants.TOKEN_EPSILON;

	var alphabet = [ '0', '1', '2' ];
	var states = [ 'q0', 'q1', 'q2' ];
	var transitionMatrix = {};

	transitionMatrix['q0'] = [];
	transitionMatrix['q0']['0'] = 'q0';
	transitionMatrix['q0']['1'] = [];
	transitionMatrix['q0']['2'] = [];
	transitionMatrix['q0'][eps] = [ 'q1' ];

	transitionMatrix['q1'] = [];
	transitionMatrix['q1']['0'] = [];
	transitionMatrix['q1']['1'] = 'q1';
	transitionMatrix['q1']['2'] = [];
	transitionMatrix['q1'][eps] = [ 'q2' ];

	transitionMatrix['q2'] = [];
	transitionMatrix['q2']['0'] = [];
	transitionMatrix['q2']['1'] = [];
	transitionMatrix['q2']['2'] = 'q2';
	transitionMatrix['q2'][eps] = [];

	var initialState = 'q0';
	var finalStates = [ 'q2' ];

	var enfaTest = new cinvestav.compu.fa.ENFA(alphabet, states, transitionMatrix, initialState, finalStates);

	// should be q1, q2
	// console.debug("test:" + enfaTest.deltaHat('q0', "2"));

	// should be q0,q1,q2
	// console.debug("eclosure(q0):" + enfaTest.eClosure('q0'));

})();

$(function() {
	// cinvestav.compu.fa.NFA.prototype = new cinvestav.compu.fa.FA();
	var eps = cinvestav.compu.constants.TOKEN_EPSILON;

	var alphabet = [ '0', '1' ];
	var states = [ 'q0', 'q1', 'q2', 'q3', 'q4' ];
	var transitionMatrix = {};

	transitionMatrix['q0'] = [];
	transitionMatrix['q0']['0'] = [ 'q0', 'q3' ];
	transitionMatrix['q0']['1'] = [ 'q0', 'q1' ];

	transitionMatrix['q1'] = [];
	transitionMatrix['q1']['0'] = [];
	transitionMatrix['q1']['1'] = 'q2';

	transitionMatrix['q2'] = [];
	transitionMatrix['q2']['0'] = 'q2';
	transitionMatrix['q2']['1'] = 'q2';

	transitionMatrix['q3'] = [];
	transitionMatrix['q3']['0'] = 'q4';
	transitionMatrix['q3']['1'] = [];

	transitionMatrix['q4'] = [];
	transitionMatrix['q4']['0'] = 'q4';
	transitionMatrix['q4']['1'] = 'q4';

	var initialState = 'q0';
	var finalStates = [ 'q2', 'q4' ];
	var acceptString = "0100";
	var notValidString = "00"

	var dfaTest = new cinvestav.compu.fa.NFA(alphabet, states, transitionMatrix, initialState, finalStates);

	// cinvestav.compu.drawFATransitionMatrix("#box-container", dfaTest);

	// console.debug("delta(q0,eps):" + dfaTest.delta("q0", ""));

	// console.debug(dfaTest.deltaWord('q0', "01001"));
	// should be q0,q1,q4

});

// test ENFA TO DFA CONVERSION
$(function() {
	var eps = cinvestav.compu.constants.TOKEN_EPSILON;

	var alphabet = [ 'a', 'b', 'c' ];
	var states = [ 'q0', 'a', 'b', 'c' ];
	var transitionMatrix = {};

	transitionMatrix['a'] = {};
	transitionMatrix['a']['a'] = 'a';
	transitionMatrix['a']['b'] = 'c';
	transitionMatrix['a']['c'] = 'b';
	transitionMatrix['a'][eps] = [];

	transitionMatrix['b'] = {};
	transitionMatrix['b']['a'] = 'a';
	transitionMatrix['b']['b'] = 'a';
	transitionMatrix['b']['c'] = 'c';
	transitionMatrix['b'][eps] = [];

	transitionMatrix['c'] = {};
	transitionMatrix['c']['a'] = 'c';
	transitionMatrix['c']['b'] = 'b';
	transitionMatrix['c']['c'] = 'a';
	transitionMatrix['c'][eps] = [];

	transitionMatrix['q0'] = {};
	transitionMatrix['q0']['a'] = 'a';
	transitionMatrix['q0']['b'] = 'b';
	transitionMatrix['q0']['c'] = 'c';
	transitionMatrix['q0'][eps] = [];

	var initialState = 'q0';
	var finalStates = [ 'a', 'b', 'c' ];

	var theENFA = new cinvestav.compu.fa.ENFA(alphabet, states, transitionMatrix, initialState, finalStates);

	// should be q1, q2

	// cinvestav.compu.drawENFA("box-container", theENFA);

});

// test ENFA TO DFA CONVERSION
$(function() {
	var eps = cinvestav.compu.constants.TOKEN_EPSILON;

	var alphabet = [ '0', '1' ];
	var states = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h' ];
	var transitionMatrix = {};

	transitionMatrix['a'] = {};
	transitionMatrix['a']['0'] = 'b';
	transitionMatrix['a']['1'] = 'f';

	transitionMatrix['b'] = {};
	transitionMatrix['b']['0'] = 'g';
	transitionMatrix['b']['1'] = 'c';

	transitionMatrix['c'] = {};
	transitionMatrix['c']['0'] = 'a';
	transitionMatrix['c']['1'] = 'c';

	transitionMatrix['d'] = {};
	transitionMatrix['d']['0'] = 'c';
	transitionMatrix['d']['1'] = 'g';

	transitionMatrix['e'] = {};
	transitionMatrix['e']['0'] = 'h';
	transitionMatrix['e']['1'] = 'f';

	transitionMatrix['f'] = {};
	transitionMatrix['f']['0'] = 'c';
	transitionMatrix['f']['1'] = 'g';

	transitionMatrix['g'] = {};
	transitionMatrix['g']['0'] = 'g';
	transitionMatrix['g']['1'] = 'e';

	transitionMatrix['h'] = {};
	transitionMatrix['h']['0'] = 'g';
	transitionMatrix['h']['1'] = 'c';


	var initialState = 'a';
	var finalStates = [ 'c' ];

	var theENFA = new cinvestav.compu.fa.DFA(alphabet, states, transitionMatrix, initialState, finalStates);

	// should be q1, q2

	// cinvestav.compu.drawENFA("box-container", theENFA);

	cinvestav.compu.utils.DFAHelper.minimize(theENFA);

});
