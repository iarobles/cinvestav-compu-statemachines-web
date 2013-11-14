$(function() {

	function showAllFieldsets(formId) {

		var theForm = $(formId);
		$("#dfa_transition_matrix").removeClass("invisible");
		$("#dfa_initial_state").removeClass("invisible");
		$("#dfa_final_states").removeClass("invisible");
		$("#dfa_test_string").removeClass("invisible");
		$("#dfa_equivalences").removeClass("invisible");
		$("#dfa_build_min_dfa").removeClass("invisible");

	}
	;

	function validateFinalStates(formSelector, dfaForm) {
		var finalStates = dfaForm["finalStates"];
		var isValid = true;

		if (finalStates.length == 0) {
			cinvestav.compu.drawError($(formSelector).find(".dfa-error-final-states"), cinvestav.compu.constants.ERROR_EMPTY_FINAL_STATES);
			isValid = false;
		} else {
			$(formSelector).find(".dfa-error-final-states").fadeOut("slow");
		}

		return isValid;
	}
	;

	function buildDFA(paramMap) {
		var transitionMatrix = paramMap["transitionMatrix"];
		var initialState = paramMap["initialState"];
		var theStates = paramMap["states"];
		var alphabet = paramMap["alphabet"];
		var finalStates = paramMap["finalStates"];

		return new cinvestav.compu.fa.DFA(alphabet, theStates, transitionMatrix, initialState, finalStates);
	}

	$("#fa_form").submit(function() {

		return false;
	});

	cinvestav.compu.drawFieldSetButtons();

	$("#build_matrix_button").button({}).click(function() {

		var alphabetAsString = cinvestav.compu.utils.cleanTokens($("#alphabetAsString").removeClass("input-error").val());
		var statesAsString = cinvestav.compu.utils.cleanTokens($("#statesAsString").removeClass("input-error").val());

		var valid = true;
		var formBox = $("#dfa_form");

		if (alphabetAsString.length == 0) {
			cinvestav.compu.drawError("#error_basicparams", cinvestav.compu.constants.ERROR_EMPTY_ALPHABET);
			$("#alphabetAsString").addClass("input-error");
			valid = false;
		}

		if (statesAsString.length == 0) {
			cinvestav.compu.drawError("#error_basicparams", cinvestav.compu.constants.ERROR_EMPTY_STATES);
			$("#statesAsString").addClass("input-error");
			valid = false;
		}

		if (valid === true) {

			$("#error_basicparams").fadeOut();
			var container = $(".min-dfa-transition-matrix");
			container.fadeOut();
			$(".min_dfa_matrix").html("");
			$("#min_dfa_graph").html("");

			$("#main_content").fadeOut(function() {
				var states = statesAsString.split(",");
				var alphabet = alphabetAsString.split(",");

				// build the transition matrix
				cinvestav.compu.drawFieldsetDFATransitionMatrix("#dfa_transition_matrix", states, alphabet);

				// draw the initial state
				cinvestav.compu.drawFieldsetInitialState("#dfa_initial_state", states, {
				name : "initialState",
				id : "initialState",
				class : "combo-box"
				});

				// draw the final states (comboboxes)
				cinvestav.compu.drawFieldsetFinalStates("#dfa_final_states", states);

				// set up all comboboxes
				$(".transition-matrix-combobox").combobox({
					inputCss : 'transition-matrix-combobox'
				});

				$(".combo-box").combobox({
					inputCss : 'transition-matrix-combobox'
				});

				if (cinvestav.compu.utils.findSymbolMaxLength(alphabet) > 1) {
					$("#dfa_form").find(".comma-separated-message").removeClass("invisible");
				} else {
					$("#dfa_form").find(".comma-separated-message").addClass("invisible");
				}

				showAllFieldsets("#dfa_form");
				$("#main_content").fadeIn("slow");
				$("#build_matrix_button").val("Construir Nueva Matriz");
			});

		} else {
			$("#main_content").fadeOut(function() {
				$("#main_content").fadeIn();
			});
		}

		return false;
	});

	$("#string_test_button").button({}).click(function() {

		var paramMap = cinvestav.compu.utils.buildDFAForm("#dfa_form");
		if (validateFinalStates("#dfa_form", paramMap)) {
			var dfa = buildDFA(paramMap);
			var errorBox = $(".test-string-not-valid");
			var acceptableBox = $(".test-string-valid");

			var stringToTest = cinvestav.compu.utils.cleanTokens(paramMap["stringToTest"]);
			try {
				if (dfa.isAcceptable(stringToTest)) {
					errorBox.fadeOut("fast");

					acceptableBox.fadeOut("slow", function() {
						acceptableBox.fadeIn("slow");
					});
				} else {// not acceptable

					acceptableBox.fadeOut("fast");
					cinvestav.compu.drawError(errorBox, cinvestav.compu.constants.INFO_NOT_ACCEPTABLE_STRING);
				}
			} catch (ex) {
				acceptableBox.fadeOut("fast");
				cinvestav.compu.drawError(errorBox, ex);
			}
		}

		return false;
	});

	$("#dfa_min_button").button({}).click(function() {

		var paramMap = cinvestav.compu.utils.buildDFAForm("#dfa_form");
		if (validateFinalStates("#dfa_form", paramMap)) {
			var dfa = buildDFA(paramMap);
			var errorBox = $(".error-dfa-min");

			try {

				var minDFA = cinvestav.compu.utils.DFAHelper.minimize(dfa);
				var container = $(".min-dfa-transition-matrix");

				$(".min_dfa_matrix").html("");
				$("#min_dfa_graph").html("");

				container.fadeOut("slow", function() {

					errorBox.fadeOut("fast");
					cinvestav.compu.drawFATransitionMatrix(".min_dfa_matrix", minDFA);
					container.fadeIn("slow", function() {

						cinvestav.compu.drawENFA("min_dfa_graph", minDFA, {
						height : (container.height() - 20),
						width : (container.width() - 20)
						});
					});
				});

			} catch (ex) {
				cinvestav.compu.drawError(errorBox, "Ocurrion un error:" + ex);
			}
		}

		return false;
	});

});