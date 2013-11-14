$(function() {

	cinvestav.compu.drawFieldSetButtons();
	$("#enfa_diagram").hide();
	$("#enfa_transition_matrix").hide();
	$("#nfa_transition_matrix").hide();
	$("#regexp_eps_span").html(cinvestav.compu.constants.TOKEN_EPSILON);

	$("#build_NFA_from_regexp").button({}).click(function() {
		var parentContainer = $("#regexp_basicparams");
		var stringToTest = parentContainer.find("input[name=stringToTest]").val();

		var alphabetAsString = parentContainer.find("input[name=alphabetAsString]").val();
		alphabetAsString = cinvestav.compu.utils.cleanTokens(alphabetAsString);

		var regularExpresionAsString = parentContainer.find("input[name=regularExpresion]").val();
		regularExpresionAsString = cinvestav.compu.utils.cleanTokens(regularExpresionAsString);

		var theAlphabetArray = alphabetAsString.split(",");

		if (alphabetAsString.length == 0) {
			cinvestav.compu.drawError("#error_basicparams", cinvestav.compu.constants.ERROR_EMPTY_ALPHABET);

			return false;
		}

		if (cinvestav.compu.utils.isAValidStateRepresentation(stringToTest, theAlphabetArray.concat([ cinvestav.compu.constants.TOKEN_EPSILON ])) == false) {
			cinvestav.compu.drawError("#error_basicparams", "La cadena a probar contiene simbolos que <strong>no</strong> estan en el Alfabeto");

			return false;
		}

		var regularExp = new cinvestav.compu.utils.RegExp(regularExpresionAsString, theAlphabetArray);

		try {
			var theENFA = regularExp.toENFA();

			$("#enfa_diagram").show("fast");

			var theWidth = $("#regexp_basicparams").width() - 60;
			$("#enfa_diagram_content").html("");
			cinvestav.compu.drawENFA("enfa_diagram_content", theENFA, {
			height : 400,
			width : theWidth
			});

			$("#enfa_transition_matrix").show("slow", function() {
				cinvestav.compu.drawFATransitionMatrix("#enfa_transition_matrix_content", theENFA);
			});

			$("#nfa_transition_matrix").show("slow", function() {
				var theNFA = cinvestav.compu.helpers.NFAHelper.ENFAToNFA(theENFA);
				cinvestav.compu.drawFATransitionMatrix("#nfa_transition_matrix_content", theNFA);
			});

			var theNFA = cinvestav.compu.helpers.NFAHelper.ENFAToNFA(theENFA);

			var paramsToSend = "";
			var theAlphabet = cinvestav.compu.utils.arrayToString(theNFA.alphabet, ",");
			var theStates = cinvestav.compu.utils.arrayToString(theNFA.states, ",");

			stringToTest = cinvestav.compu.utils.cleanTokens(stringToTest);
			stringToTest = stringToTest.replace(cinvestav.compu.constants.TOKEN_EPSILON, "");

			paramsToSend = "alphabet=" + theAlphabet;
			paramsToSend = paramsToSend + "&alphabetAsString=" + theAlphabet;
			paramsToSend = paramsToSend + "&alphabetLength=" + theNFA.alphabet.length;
			paramsToSend = paramsToSend + "&finalStates=" + cinvestav.compu.utils.findIndicesFromArray(theNFA.states, theNFA.finalStates);
			paramsToSend = paramsToSend + "&initialState=" + theNFA.states.indexOf(theNFA.initialState);
			paramsToSend = paramsToSend + "&states=" + theStates;
			paramsToSend = paramsToSend + "&statesAsString=" + theStates;
			paramsToSend = paramsToSend + "&totalStates=" + theNFA.states.length;
			paramsToSend = paramsToSend + "&isAjax=true";
			paramsToSend = paramsToSend + "&_includeDFARepresentation=on&includeDFARepresentation=true";
			paramsToSend = paramsToSend + "&" + theNFA.transitionMatrixToString();
			paramsToSend = paramsToSend + "stringToTest=" + stringToTest;

			// console.debug(paramsToSend);

			$("#regexp_to_dfa_result").fadeOut("slow", function() {

				$.post(cinvestav.compu.constants.URL_NFA_TO_DFA_ONLY_MATRIX, paramsToSend, function(htmlResponse) {
					cinvestav.compu.drawHtml("#regexp_to_dfa_result", htmlResponse);
				});
				
				$("#regexp_to_dfa_result").fadeIn("slow");
			});

			// console.debug("params to send:" + paramsToSend);

			$("#error_basicparams").fadeOut();

		} catch (ex) {
			cinvestav.compu.drawError("#error_basicparams", ex);
		}

		return false;
	});
});
