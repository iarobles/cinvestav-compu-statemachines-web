cinvestav.compu.fa = {};
cinvestav.compu.constants.TOKEN_EPSILON = "EPS";
cinvestav.compu.constants.TOKEN_EMPTY_SET = "_EMPTY_";
cinvestav.compu.fa.DFA = function(alphabet, states, transitionMatrix, initialState, finalStates) {
	this.alphabet = alphabet;
	this.states = states;
	this.transitionMatrix = transitionMatrix;
	this.initialState = initialState;
	this.finalStates = finalStates;
	// a helper variable to know if one of the symbols is composed of two or
	// more characters
	this.symbolMaxLength = cinvestav.compu.utils.findSymbolMaxLength(this.alphabet);

	this.getNonFinalStates = function() {
		var nonFinalStates = [];

		for ( var stateIndex = 0; stateIndex < this.states.length; stateIndex++) {
			var aState = this.states[stateIndex];

			// it aState is not a final state
			if (this.finalStates.indexOf(aState) == -1) {
				nonFinalStates.push(aState);
			}
		}

		return nonFinalStates;
	};

	/* helper functions */
	this.arrayToString = function(theArray) {
		var index;
		var arrayRepresentation = "";
		for (index = 0; index < theArray.length; index++) {

			if (arrayRepresentation != "") {
				arrayRepresentation = arrayRepresentation + "," + theArray[index];
			} else {
				arrayRepresentation = theArray[index];
			}
		}

		return arrayRepresentation;
	};

	/* private variables */
	var epsToken = cinvestav.compu.constants.TOKEN_EPSILON;
	var emptySetToken = cinvestav.compu.constants.TOKEN_EMPTY_SET;
	var epsRepetitionRegExp = new RegExp("(" + epsToken + "){2,}", "g");
	// (eps)*
	var epsStarRegExp = new RegExp("\\(" + epsToken + "\\)\\*", "g");
	var unionOfEps = new RegExp(epsToken + "\\+" + epsToken, "g");
	var alphabetAsString = this.arrayToString(this.alphabet);
	var epsSymbolRegExp = new RegExp(epsToken + "\\(*[" + alphabetAsString + "]");
	var symbolEpsRegExp = new RegExp("[" + alphabetAsString + "]\\)*" + epsToken);
	// (word+eps)*
	var symbolUnionEpsStarRegExp = new RegExp("\\(([" + alphabetAsString + "]*)\\+" + epsToken + "\\)\\*", "g");
	// (eps + word)*
	var epsUnionSymbolStarRegExp = new RegExp("\\(" + epsToken + "\\+([" + alphabetAsString + "]*)\\)\\*", "g");

	var symbolUnionEmpty = new RegExp("\\+" + emptySetToken, "g");
	var emptyUnionSymbol = new RegExp(emptySetToken + "\\+", "g");
	var symbolEmptySymbol = new RegExp("\\(*[" + alphabetAsString + "," + epsToken + "]*\\)*" + emptySetToken + "\\(*[" + alphabetAsString + "," + epsToken + "]*\\)*", "g");

	var repeatedUnionRegExp = new RegExp("^([" + alphabetAsString + "])\\+\\1$", "g");

	// 0(00)*0 + eps = (00)*
	var rule15 = new RegExp("([" + alphabetAsString + "])\\(\\1\\1\\)\\*\\1\\+" + epsToken, "g");

	this.simplify = function(theString) {

		var theFormattedString;

		theFormattedString = theString.replace(epsStarRegExp, epsToken);
		theFormattedString = theFormattedString.replace(epsRepetitionRegExp, epsToken);
		theFormattedString = theFormattedString.replace(unionOfEps, epsToken);

		// change epsTokena-> a
		// console.debug("epsSymbolRegExp:" + epsSymbolRegExp);
		var lastIndex = theFormattedString.search(epsSymbolRegExp);
		var counter = 0;
		while (lastIndex != -1) {
			counter++;
			theFormattedString = theFormattedString.substring(0, lastIndex) + theFormattedString.substring(lastIndex + epsToken.length, theFormattedString.length);
			lastIndex = theFormattedString.search(epsSymbolRegExp);
			// console.debug("last index:" + lastIndex + ", tmp:" +
			// theFormattedString);
			if (counter > 100)
				break;
		}

		// change aepsToken -> a
		// console.debug("symbolEpsRegExp:" + symbolEpsRegExp);
		var lastIndex = theFormattedString.search(symbolEpsRegExp);
		// console.debug("last index:" + lastIndex + ", tmp:" +
		// theFormattedString);
		var counter = 0;
		while (lastIndex != -1) {
			counter++;
			var matches = theFormattedString.match(symbolEpsRegExp);
			var epsMatchIndex = lastIndex + matches[0].length - epsToken.length;
			theFormattedString = theFormattedString.substring(0, epsMatchIndex) + theFormattedString.substring(epsMatchIndex + epsToken.length, theFormattedString.length);
			lastIndex = theFormattedString.search(symbolEpsRegExp);
			// console.debug("last index:" + lastIndex + ", tmp:" +
			// theFormattedString);
			if (counter > 100)
				break;
		}

		theFormattedString = theFormattedString.replace(symbolEmptySymbol, emptySetToken);
		theFormattedString = theFormattedString.replace(symbolUnionEmpty, "");
		theFormattedString = theFormattedString.replace(emptyUnionSymbol, "");
		theFormattedString = theFormattedString.replace(symbolUnionEpsStarRegExp, "($1)*");
		theFormattedString = theFormattedString.replace(epsUnionSymbolStarRegExp, "($1)*");
		/*
		 * // change (word + eps)* -> (word)* var lastIndex =
		 * theFormattedString.search(symbolUnionEpsStarRegExp); //
		 * console.debug("last index:" + lastIndex + ", regExp:" + //
		 * symbolUnionEpsStarRegExp + " string:" + theFormattedString); var
		 * counter = 0; while (lastIndex != -1) { counter++; var matches =
		 * theFormattedString.match(symbolUnionEpsStarRegExp); var epsMatchIndex =
		 * lastIndex + matches[0].length - (epsToken.length + 3);
		 * theFormattedString = theFormattedString.substring(0, epsMatchIndex) +
		 * theFormattedString.substring(epsMatchIndex + epsToken.length + 1,
		 * theFormattedString.length); lastIndex =
		 * theFormattedString.search(symbolUnionEpsStarRegExp); //
		 * console.debug("last index:" + lastIndex + ", tmp:" + //
		 * theFormattedString); if (counter > 100) break; }
		 */

		/*
		 * // change (eps + word)* -> (word)* var lastIndex =
		 * theFormattedString.search(epsUnionSymbolStarRegExp); //
		 * console.debug("eps last index:" + lastIndex + ", regExp:" + //
		 * epsUnionSymbolStarRegExp + " string:" + theFormattedString); var
		 * counter = 0; while (lastIndex != -1) { counter++; var matches =
		 * theFormattedString.match(epsUnionSymbolStarRegExp); var epsMatchIndex =
		 * lastIndex + 1; theFormattedString = theFormattedString.substring(0,
		 * epsMatchIndex) + theFormattedString.substring(epsMatchIndex +
		 * epsToken.length + 1, theFormattedString.length); lastIndex =
		 * theFormattedString.search(epsUnionSymbolStarRegExp); //
		 * console.debug("last index:" + lastIndex + ", tmp:" + //
		 * theFormattedString); if (counter > 100) break; }
		 */

		theFormattedString = theFormattedString.replace(repeatedUnionRegExp, "$1");
		theFormattedString = theFormattedString.replace(rule15, "($1$1)*");

		return theFormattedString;
	};

	this.delta = function(state, symbol) {
		return this.transitionMatrix[state][symbol];
	};

	this.deltaWord = function(initialState, word) {
		var state, symbolCounter;

		if (word == null || word.length == 0) {
			state = this.initialState;
		} else {

			state = initialState;
			for (symbolCounter = 0; symbolCounter < word.length; symbolCounter++) {
				state = this.delta(state, word[symbolCounter]);
			}
		}

		return state;
	};

	this.isAcceptable = function(word) {
		var arrayOfSymbols;

		if (typeof (word) == "string") {

			if (word.length == 0) {// we expect comma separated symbols
				arrayOfSymbols = [];
			} else if (this.symbolMaxLength > 1 || word.indexOf(",") != -1) {
				arrayOfSymbols = word.split(",");
			} else {
				arrayOfSymbols = word.split("");
			}

		} else {
			arrayOfSymbols = word;
		}

		// check if the string contains valid symbols
		for ( var index = 0; index < arrayOfSymbols.length; index++) {
			var aSymbol = arrayOfSymbols[index];
			if (this.alphabet.indexOf(aSymbol) == -1) {
				throw cinvestav.compu.constants.ERROR_NOT_VALID_SYMBOL + aSymbol;
			}
		}

		var finalState = this.deltaWord(this.initialState, arrayOfSymbols);

		return (this.finalStates.indexOf(finalState) != -1) ? true : false;
	};

	this.toRegExpZero = function(i, j) {
		var regExp = "", state, symbolIndex, symbol;
		var qi = this.states[i];
		var qj = this.states[j];

		for (symbolIndex = 0; symbolIndex < this.alphabet.length; symbolIndex++) {
			symbol = this.alphabet[symbolIndex];

			state = this.delta(qi, symbol);

			if (state == qj) {

				if (regExp != "") {
					regExp = regExp + "+" + symbol;
				} else {
					regExp = symbol;
				}
			}
		}

		// add the epsilon symbol
		if (i == j) {
			regExp = cinvestav.compu.constants.TOKEN_EPSILON + regExp;
		}

		return (regExp == "") ? cinvestav.compu.constants.TOKEN_EMPTY_SET : regExp;
	};

	this.toRegExp = function(i, j, k, simplifyEnabled) {
		var regExp;

		if (typeof (simplifyEnabled) == 'undefined') {
			var simplifyEnabled = false;
		}

		if (typeof (i) == 'undefined' || typeof (j) == 'undefined' || typeof (k) == 'undefined')
			return "ERROR i,j,k are empty";

		if (k == -1) {
			regExp = this.toRegExpZero(i, j);
		} else {
			// Ri(k-1)
			var Rik_1 = this.toRegExp(i, k, k - 1, simplifyEnabled);
			Rik_1 = (Rik_1.indexOf("+") == -1) ? Rik_1 : "(" + Rik_1 + ")";

			var Rkk = this.toRegExp(k, k, k - 1, simplifyEnabled);
			var Rkj = this.toRegExp(k, j, k - 1, simplifyEnabled);
			Rkj = (Rkj.indexOf("+") == -1) ? Rkj : "(" + Rkj + ")";

			var Rij = this.toRegExp(i, j, k - 1, simplifyEnabled);

			regExp = Rik_1 + "(" + Rkk + ")*" + Rkj + "+" + Rij;
		}

		regExp = (simplifyEnabled) ? this.simplify(regExp) : regExp;
		// regExp = (regExp.indexOf("+") != -1)?"(" + regExp + ")":regExp;
		return regExp;
	};

	this.equivalentRegExp = function(simplifyEnabled) {

		if (typeof (simplifyEnabled) == 'undefined') {
			var simplifyEnabled = false;
		}

		var finalStateIndex = 0;
		var theRegExp = "";
		var totalStates = this.states.length;
		for (finalStateIndex = 0; finalStateIndex < this.finalStates.length; finalStateIndex++) {

			var finalState = this.finalStates[finalStateIndex];
			var subRegExp = this.toRegExp(0, this.states.indexOf(finalState), totalStates - 1, simplifyEnabled);
			if (theRegExp == "") {
				theRegExp = subRegExp;
			} else {
				theRegExp = theRegExp + " + " + subRegExp;
			}

		}

		return theRegExp;
	};
};