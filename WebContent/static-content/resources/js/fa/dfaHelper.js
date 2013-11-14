cinvestav.compu.utils.DFAHelper = {};// singleton

cinvestav.compu.utils.DFAHelper.arrayToString = function(theArray, prefix, suffix, baseArray) {

	var arrayAsString = "";
	for ( var index = 0; index < theArray.length; index++) {
		var theElement;

		if (typeof (baseArray) != 'undefined') {
			theElement = baseArray.indexOf(theArray[index]);
		} else {
			theElement = theArray[index];
		}

		theElement = prefix + theElement + suffix;

		if (arrayAsString == "") {
			arrayAsString = theElement;
		} else {
			arrayAsString = arrayAsString + "," + theElement;
		}
	}

	return arrayAsString;
};

cinvestav.compu.utils.DFAHelper.matrixToString = function(transitionMatrix, alphabet, states) {
	var matrixAsString = "";

	for ( var stateIndex = 0; stateIndex < states.length; stateIndex++) {
		var aState = states[stateIndex];
		matrixAsString = (matrixAsString == "") ? "{" : matrixAsString + ",{";
		var aRow = "";
		for ( var alphabetIndex = 0; alphabetIndex < alphabet.length; alphabetIndex++) {

			var aSymbol = alphabet[alphabetIndex];
			if (aRow == "") {
				aRow = states.indexOf(transitionMatrix[aState][aSymbol]);
			} else {
				aRow = aRow + "," + states.indexOf(transitionMatrix[aState][aSymbol]);
			}
		}
		matrixAsString = matrixAsString + aRow + "}";
	}

	return matrixAsString;
};

cinvestav.compu.utils.DFAHelper.getEquivalentCodeInC = function(dfa) {
	var codeTemplateForC = new cinvestav.compu.templates.CodeTemplateForC();

	var ltSymbol = "&lt", gtSymbol = "&gt";
	var generatedCode = codeTemplateForC.CODE_TEMPLATE.replace(new RegExp(codeTemplateForC.ALPHABET_SIZE_TOKEN, "g"), dfa.alphabet.length);
	generatedCode = generatedCode.replace(new RegExp(codeTemplateForC.LESSTHAN_SYMBOL, "g"), ltSymbol);
	generatedCode = generatedCode.replace(new RegExp(codeTemplateForC.GREATHERTHAN_SYMBOL, "g"), gtSymbol);
	generatedCode = generatedCode.replace(new RegExp(codeTemplateForC.ALPHABET_TOKEN, "g"), this.arrayToString(dfa.alphabet, "\'", "\'"));
	generatedCode = generatedCode.replace(new RegExp(codeTemplateForC.INITIAL_STATE_TOKEN, "g"), dfa.states.indexOf(dfa.initialState));
	generatedCode = generatedCode.replace(new RegExp(codeTemplateForC.STATES_SIZE_TOKEN, "g"), dfa.states.length + "");
	generatedCode = generatedCode.replace(new RegExp(codeTemplateForC.FINAL_STATES_TOKEN, "g"), this.arrayToString(dfa.finalStates, "", "", dfa.states));
	generatedCode = generatedCode.replace(new RegExp(codeTemplateForC.FINAL_STATES_SIZE_TOKEN, "g"), dfa.finalStates.length);
	generatedCode = generatedCode.replace(new RegExp(codeTemplateForC.TRANSITION_MATRIX_TOKEN, "g"), this.matrixToString(dfa.transitionMatrix, dfa.alphabet, dfa.states));

	return generatedCode;
};

cinvestav.compu.utils.DFAHelper.minimize = function(dfa) {
	var nonFinalStates = dfa.getNonFinalStates();
	var finalStates = dfa.finalStates;
	var alphabet = dfa.alphabet;

	var equivalenceMatrix = new cinvestav.compu.utils.DFAHelper.EquivalenceMatrix(dfa.states);

	// mark all final and non final as non equivalent
	var totalFinalStates = 1;
	for ( var rowStateIndex = 1; rowStateIndex < dfa.states.length; rowStateIndex++) {
		var rowState = dfa.states[rowStateIndex];

		for ( var columnStateIndex = 0; columnStateIndex < totalFinalStates; columnStateIndex++) {
			var columnState = dfa.states[columnStateIndex];

			if (finalStates.indexOf(columnState) != -1 || finalStates.indexOf(rowState) != -1) {
				equivalenceMatrix.mark(rowState, columnState);
			}
		}
		totalFinalStates++;
	}

	// for each pair of states (p,q) in FxF or (Q-F)x(Q-F) do
	var totalFinalStates = 1;
	for ( var rowStateIndex = 1; rowStateIndex < nonFinalStates.length; rowStateIndex++) {
		var rowState = nonFinalStates[rowStateIndex];

		for ( var columnStateIndex = 0; columnStateIndex < totalFinalStates; columnStateIndex++) {
			var columnState = nonFinalStates[columnStateIndex];

			if (columnState != rowState) {
				var isMarked = false;
				for ( var alphabetIndex = 0; alphabetIndex < alphabet.length; alphabetIndex++) {
					var symbol = alphabet[alphabetIndex];

					//console.debug("rowState:" + rowState + ", columnState:" + columnState + ", symbol:" + symbol);
					var state1 = dfa.delta(rowState, symbol);
					var state2 = dfa.delta(columnState, symbol);

					if (state1 == state2) {
						continue;
					}

					//console.debug("testing if (" + state1 + "," + state2 + ") are marked");
					isMarked = equivalenceMatrix.isMarked(state1, state2);

					if (isMarked) {

						//console.debug("(" + state1 + "," + state2 + ") are marked, " + ", (" + rowState + "," + columnState + ") will be marked");
						equivalenceMatrix.markRecursively(rowState, columnState);

						break;
					}
				}

				/* no pair (delta(p,a), delta(q,a)) is marked */
				if (!isMarked) {

					for ( var alphabetIndex = 0; alphabetIndex < alphabet.length; alphabetIndex++) {
						var symbol = alphabet.indexOf(alphabetIndex);
						var state1 = dfa.delta(rowState, symbol);
						var state2 = dfa.delta(columnState, symbol);

						if (state1 != state2) {
							equivalenceMatrix.addPair(rowState, columnState, [ state1, state2 ]);
						}
					}
				}
			}
		}
		totalFinalStates++;
	}

	var equivalentPairs = equivalenceMatrix.getEquivalentPairs();
	var disjointPartitions = cinvestav.compu.utils.findDisjointPartitionClasses(equivalentPairs);

	var allEquivalentStates = [];
	var minimizedStates = [];
	for ( var partitionIndex = 0; partitionIndex < disjointPartitions.length; partitionIndex++) {
		var aPartition = disjointPartitions[partitionIndex];

		allEquivalentStates = allEquivalentStates.concat(aPartition);
	}

	allEquivalentStates = allEquivalentStates.unique();

	for ( var stateIndex = 0; stateIndex < dfa.states.length; stateIndex++) {
		var aState = dfa.states[stateIndex];

		if (allEquivalentStates.indexOf(aState) == -1) {
			minimizedStates.push(aState);
		}
	}

	minimizedStates = minimizedStates.concat(disjointPartitions);
	var newMinimizedState = [];

	// set initial state
	// change all minimized states as [state]
	// build transition matrix
	// set finalStates
	var newTransitionMatrix = {};
	var newFinalStates = [];
	var newInitialState = null;
	for ( var stateIndex = 0; stateIndex < minimizedStates.length; stateIndex++) {
		var aState = minimizedStates[stateIndex];
		aState = (typeof (aState) == "string") ? [ aState ] : aState;

		var newState = "[" + cinvestav.compu.utils.arrayToString(aState, ",") + "]";
		newMinimizedState.push(newState);

		newTransitionMatrix[newState] = {};
		if (aState.indexOf(dfa.initialState) != -1) {
			newInitialState = newState;
		}

		for ( var finalStateIndex = 0; finalStateIndex < dfa.finalStates.length; finalStateIndex++) {

			if (aState.indexOf(dfa.finalStates[finalStateIndex]) != -1) {
				newFinalStates.push(newState);
			}
		}

		for ( var symbolIndex = 0; symbolIndex < dfa.alphabet.length; symbolIndex++) {
			var aSymbol = dfa.alphabet[symbolIndex];

			var oldState = dfa.delta(aState[0], aSymbol);

			// search for its equivalent states in the
			// minimized matrix
			for ( var minStateIndex = 0; minStateIndex < minimizedStates.length; minStateIndex++) {
				var theState = minimizedStates[minStateIndex];
				theState = (typeof (theState) == "string") ? [ theState ] : theState;

				if (theState.indexOf(oldState) != -1) {
					newTransitionMatrix[newState][aSymbol] = "[" + cinvestav.compu.utils.arrayToString(theState, ",") + "]";
					break;
				}

			}
		}
	}

	return new cinvestav.compu.fa.DFA(dfa.alphabet, newMinimizedState, newTransitionMatrix, newInitialState, newFinalStates);
};

cinvestav.compu.utils.findDisjointPartitionClasses = function(originalSubsets) {
	var partitionClasses = originalSubsets.slice();
	var partitionClassesPreviousSize = partitionClasses.length;
	var disjointPartitionClasses = [];

	while (partitionClasses.length > 0) {

		var lastSet = partitionClasses[partitionClasses.length - 1];
		partitionClassesPreviousSize = partitionClasses.length;

		for ( var setIndex = 1; setIndex < partitionClasses.length; setIndex++) {
			var currentSet = partitionClasses[setIndex];

			for ( var itemIndex = 0; itemIndex < currentSet.length; itemIndex++) {
				var aItem = currentSet[itemIndex];

				// if the current set has a element in common with the
				// first set it means that they are equivalent
				if (lastSet.indexOf(aItem) != -1) {
					var newSet = lastSet;
					newSet = newSet.concat(currentSet);
					partitionClasses.pop();// pop the first set
					partitionClasses.push(newSet);
					break;
				}
			}

			// something has changed, a reset is necessary
			if (partitionClasses.length != partitionClassesPreviousSize) {
				break;
			}

		}

		// lastSet is disjoint
		if (partitionClasses.length == partitionClassesPreviousSize) {

			disjointPartitionClasses.push(lastSet);
			partitionClasses.pop();// pop the first set
		}

	}

	return disjointPartitionClasses;
};

cinvestav.compu.utils.DFAHelper.EquivalenceMatrix = function(theStates) {
	var nonEquivalentStates = {};
	var pairMatrix = {};
	this.temp = nonEquivalentStates;

	var totalFinalStates = 1;
	for ( var rowStateIndex = 1; rowStateIndex < theStates.length; rowStateIndex++) {
		var rowState = theStates[rowStateIndex];

		nonEquivalentStates[rowState] = {};
		pairMatrix[rowState] = {};

		for ( var columnStateIndex = 0; columnStateIndex < totalFinalStates; columnStateIndex++) {
			var columnState = theStates[columnStateIndex];
			nonEquivalentStates[rowState][columnState] = null;
			pairMatrix[rowState][columnState] = [];
		}
		totalFinalStates++;
	}

	this.mark = function(stateRow, stateColumn) {

		if (typeof (nonEquivalentStates[stateRow]) != 'undefined') {
			nonEquivalentStates[stateRow][stateColumn] = true;
		} else if (typeof (nonEquivalentStates[stateColumn]) != 'undefined') {
			nonEquivalentStates[stateColumn][stateRow] = true;
		} else {
			throw "Los estados:(" + stateRow + "," + stateColumn + ") no estan definidos en la matriz de no equivalencia";
		}
	};

	this.isMarked = function(stateRow, stateColumn) {

		if (typeof (nonEquivalentStates[stateRow]) != 'undefined' && typeof (nonEquivalentStates[stateRow][stateColumn]) != 'undefined') {
			return (nonEquivalentStates[stateRow][stateColumn] == null) ? false : true;

		} else if (typeof (nonEquivalentStates[stateColumn]) != 'undefined' && typeof (nonEquivalentStates[stateColumn][stateRow]) != 'undefined') {

			return (nonEquivalentStates[stateColumn][stateRow] == null) ? false : true;
		} else {
			throw "Los estados:(" + stateRow + "," + stateColumn + ") no estan definidos en la matriz de no equivalencia";
		}
	};

	this.addPair = function(stateColumn, stateRow, thePairOfStates) {

		if (typeof (pairMatrix[stateRow]) != 'undefined' && typeof (pairMatrix[stateRow][stateColumn]) != 'undefined') {

			var temp = pairMatrix[stateRow][stateColumn];
			pairMatrix[stateRow][stateColumn] = temp.push(thePairOfStates);

		} else if (typeof (pairMatrix[stateColumn]) != 'undefined' && typeof (pairMatrix[stateColumn][stateRow]) != 'undefined') {

			var temp = pairMatrix[stateColumn][stateRow];
			pairMatrix[stateColumn][stateRow] = temp.push(thePairOfStates);
		} else {
			throw "Los estados:(" + stateRow + "," + stateColumn + ") no estan definidos en la matriz de pares";
		}

	};

	this.getPair = function(stateColumn, stateRow) {

		if (typeof (pairMatrix[stateRow]) != 'undefined' && typeof (pairMatrix[stateRow][stateColumn]) != 'undefined') {

			return pairMatrix[stateRow][stateColumn];

		} else if (typeof (pairMatrix[stateColumn]) != 'undefined' && typeof (pairMatrix[stateColumn][stateRow]) != 'undefined') {

			return pairMatrix[stateColumn][stateRow];
		} else {

			throw "Los estados:(" + stateRow + "," + stateColumn + ") no estan definidos en la matriz de pares";
		}
	};

	this.markRecursively = function(rowState, columnState) {

		//console.debug("will mark recursively to (" + rowState + "," + columnState + ")");
		this.mark(rowState, columnState);
		var pairOfStates = this.getPair(rowState, columnState);

		for ( var pairIndex = 0; pairIndex < pairOfStates.length; pairIndex++) {
			var thePair = pairMatrix[pairIndex];

			this.markRecursively(thePair[0], thePair[1]);
		}
	};

	this.getEquivalentPairs = function() {
		var totalFinalStates = 1;
		var equivalentPairs = [];

		for ( var rowStateIndex = 1; rowStateIndex < theStates.length; rowStateIndex++) {
			var rowState = theStates[rowStateIndex];

			for ( var columnStateIndex = 0; columnStateIndex < totalFinalStates; columnStateIndex++) {
				var columnState = theStates[columnStateIndex];

				if (!this.isMarked(rowState, columnState)) {
					equivalentPairs.push([ rowState, columnState ]);
				}

			}
			totalFinalStates++;
		}

		return equivalentPairs;
	};
};
