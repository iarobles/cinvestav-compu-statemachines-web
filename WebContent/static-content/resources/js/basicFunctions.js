Array.prototype.unique = function() {
	var a = this.concat();
	for ( var i = 0; i < a.length; ++i) {
		for ( var j = i + 1; j < a.length; ++j) {
			if (a[i] === a[j])
				a.splice(j, 1);
		}
	}

	return a;
};

var cinvestav = {};
cinvestav.compu = {};
cinvestav.compu.constants = {};
cinvestav.compu.utils = {};

/* valid urls */
cinvestav.compu.constants.URL_FAPARAMS_AND_MATRIX = "index.do";
cinvestav.compu.constants.URL_FA_TEST = "test.do";
cinvestav.compu.constants.URL_NFA_TO_DFA_ONLY_MATRIX = "../nfa/buildFromDFA.do";

cinvestav.compu.constants.ERROR_EMPTY_ALPHABET = "<strong>Error</strong>: Debe introducir un <strong>alfabeto</strong>";
cinvestav.compu.constants.ERROR_EMPTY_STATES = "<strong>Error</strong>: Debe introducir <strong>estados</strong>";
cinvestav.compu.constants.ERROR_EMPTY_FINAL_STATES = "<strong>Error</strong>: Debe seleccionar al menos un <strong>Estado final</strong>";
cinvestav.compu.constants.ERROR_NOT_VALID_SYMBOL = "<strong>Error</strong>: La cadena contiene un simbolo no v&aacute;lido:";
cinvestav.compu.constants.INFO_NOT_ACCEPTABLE_STRING = "La cadena <strong>NO</strong> es aceptada por el automata";

// context free grammar errors
cinvestav.compu.constants.ERROR_EMPTY_TERMINALS = "<strong>Error</strong>: No ha introducido <strong>terminales</strong>";
cinvestav.compu.constants.ERROR_EMPTY_VARIABLES = "<strong>Error</strong>: No ha introducido <strong>variables</strong>";
cinvestav.compu.constants.ERROR_EMPTY_START_SYMBOL = "<strong>Error</strong>: No ha introducido <strong>Simbolo Inicial</strong>";
cinvestav.compu.constants.ERROR_NO_DERIVATIONS_FOR_STRING = "No hay derivaciones para la cadena introducida";
cinvestav.compu.constants.ERROR_EMPTY_TEST_STRING = "<strong>Error</strong>: la cadena a probar no debe estar vac&iacute;a";
cinvestav.compu.constants.ERROR_NOT_VALID_TERMINALS = "<strong>Error</strong>: la cadena a probar contiene terminales no v&aacute;lidas:";

/**
 * Dado un alfabeto regresa la cantidad de caracteres que tiene el simbolo con
 * mas caracteres.
 * 
 * @param alphabet
 * @returns {Number}
 */
cinvestav.compu.utils.findSymbolMaxLength = function(alphabet) {
	var symbolMaxLength = 0;

	if (typeof (alphabet) != 'undefined') {
		for ( var index = 0; index < alphabet.length; index++) {
			var theSymbol = alphabet[index];

			if (theSymbol.length > symbolMaxLength) {
				symbolMaxLength = alphabet[index].length;
			}
		}
	}

	return symbolMaxLength;
};

cinvestav.compu.utils.findIndicesFromArray = function(baseArray, itemsToSearch) {
	var theIndices = [];

	for ( var itemIndex = 0; itemIndex < itemsToSearch.length; itemIndex++) {
		theIndices = theIndices.concat(baseArray.indexOf(itemsToSearch[itemIndex]));
	}

	return theIndices;
};

/**
 * transform an array[a1, a2, ...,an] to an string of the form a1,a2,...,an
 * 
 * @param theArray
 * @returns {String}
 */
cinvestav.compu.utils.arrayToString = function(theArray, delimiter) {
	var index;
	var arrayRepresentation = "";

	if (typeof (delimiter) == 'undefined') {
		var delimiter = ",";
	}

	for (index = 0; index < theArray.length; index++) {

		if (arrayRepresentation != "") {
			arrayRepresentation = arrayRepresentation + delimiter + theArray[index];
		} else {
			arrayRepresentation = theArray[index];
		}
	}

	return arrayRepresentation;
};

cinvestav.compu.rollTo = function(divCssSelector, anOffset) {
	var theOffset = (typeof (anOffset) == 'undefined') ? -80 : anOffset;
	var rollToDiv = $(divCssSelector);
	if (rollToDiv) {
		var finalTop = (rollToDiv.offset().top + theOffset) + "px";

		$("html,body").animate({
			scrollTop : finalTop
		}, "slow", "swing");

	}
};

// priave method?
cinvestav.compu.utils.buildDFAForm = function(formSelector) {
	var theForm = $(formSelector);
	var propertyMap = {};

	var transitionMatrix = {};
	var finalStates = new Array();

	$.each(theForm.serializeArray(), function(index, property) {
		var propertyName = property.name;

		if (propertyName.indexOf("finalStates") != -1) {
			finalStates.push(property.value);
		} else if (propertyName.indexOf("transitionMatrix") == -1) {

			propertyMap[propertyName] = property.value;
		} else {
			var stateAndSymbol = propertyName.replace("transitionMatrix", "").replace("][", ",").replace("[", "").replace("]", "").split(",");

			var stateIndex = stateAndSymbol[0];
			var symbolIndex = stateAndSymbol[1];
			if (typeof (transitionMatrix[stateIndex]) == 'undefined') {
				transitionMatrix[stateIndex] = {};
			}

			transitionMatrix[stateIndex][symbolIndex] = property.value;
		}
	});

	propertyMap["alphabet"] = cinvestav.compu.utils.cleanTokens(propertyMap["alphabetAsString"]).split(",");
	propertyMap["states"] = cinvestav.compu.utils.cleanTokens(propertyMap["statesAsString"]).split(",");
	propertyMap["transitionMatrix"] = transitionMatrix;
	propertyMap["finalStates"] = finalStates;

	return propertyMap;
};

cinvestav.compu.utils.cleanTokens = function(stringToClean, validTokens) {
	var tokensInAString = stringToClean.replace(/\s/g, "");

	tokensInAString = tokensInAString.split(",");
	var tokenIndex = 0;
	var stringCleaned = "";
	var totalTokens = tokensInAString.length;
	var validToken = true;

	for (tokenIndex = 0; tokenIndex < totalTokens; tokenIndex++) {

		var token = tokensInAString[tokenIndex];
		if (token != null && token != "") {
			// console.debug("token:\"" + token + "\"");

			if (validTokens) {

				if (validTokens.indexOf(token) != -1) {
					validToken = true;
				} else {
					validToken = false;
				}

			}

			// console.debug("tokenIndex:" + tokenIndex + ", totalTokens:" +
			// totalTokens);
			if (tokenIndex > 0 && validToken == true) {
				stringCleaned = stringCleaned + ",";
			}

			if (validToken == true) {
				stringCleaned = stringCleaned + token;
			}

		}
	}

	// console.debug(stringCleaned);
	return stringCleaned;
};

cinvestav.compu.utils.findNotValidSymbols = function(stringToTest, validSymbols) {

	var symbols = [];
	var notValidSymbols = [];
	if (stringToTest.indexOf(",") != -1) {
		symbols = stringToTest.split(",");
	} else {
		symbols = stringToTest.split("");
	}

	var symbolIndex = 0;

	for (symbolIndex = 0; symbolIndex < symbols.length; symbolIndex++) {

		var theSymbolToSearch = symbols[symbolIndex];

		if (theSymbolToSearch != "" && validSymbols.indexOf(theSymbolToSearch) < 0) {
			notValidSymbols.push(theSymbolToSearch);
		}
	}

	return notValidSymbols;
};

cinvestav.compu.utils.isAValidStateRepresentation = function(stateAsString, theStates) {
	var statesInString = stateAsString.split(",");
	var statesInStringIndex = 0;

	for (statesInStringIndex = 0; statesInStringIndex < statesInString.length; statesInStringIndex++) {

		var theStateToSearch = statesInString[statesInStringIndex];

		if (theStateToSearch != "" && theStates.indexOf(theStateToSearch) < 0) {
			return false;
		}
	}

	return true;
};

cinvestav.compu.sendData = function(formSelector, urlToConsult, callbackFunction) {
	var paramsToSend = $(formSelector).serialize();
	paramsToSend = paramsToSend + "&isAjax=true";

	$.post(urlToConsult, paramsToSend, function(htmlResponse) {
		callbackFunction(htmlResponse);
	});
};