var cinvestav = {};
cinvestav.compu = {};
cinvestav.compu.constants = {};
cinvestav.compu.utils = {};

cinvestav.compu.constants.URL_FAPARAMS_AND_MATRIX = "index.do";
cinvestav.compu.constants.URL_FA_TEST = "test.do";

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
			//console.debug("token:\"" + token + "\"");

			if (validTokens) {

				if (validTokens.indexOf(token) != -1) {
					validToken = true;
				} else {
					validToken = false;
				}

			}

			//console.debug("tokenIndex:" + tokenIndex + ", totalTokens:" + totalTokens);
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

cinvestav.compu.utils.isAValidStateRepresentation = function(stateAsString,
		theStates) {
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

cinvestav.compu.drawHtml = function(divSelector, htmlResponse) {
	var mainDiv = $(divSelector);

	mainDiv.fadeOut("slow", function() {

		mainDiv.html(htmlResponse);
		mainDiv.fadeIn();

	});
};

cinvestav.compu.sendForm = function(urlToConsult, formSelector,
		divToDrawResponse) {
	var paramsToSend = $(formSelector).serialize();
	paramsToSend = paramsToSend + "&isAjax=true";

	$.post(urlToConsult, paramsToSend, function(htmlResponse) {
		cinvestav.compu.drawHtml(divToDrawResponse, htmlResponse);
	});
};

cinvestav.compu.initLayout = function() {

	$("#fa_form").submit(function() {

		return false;
	});

	$(".fieldset-button").button({
		icons : {
			primary : 'ui-icon-triangle-1-s'
		},
		text : '',
	}).click(
			function() {
				var button = $(this).find(".ui-button-icon-primary");
				var iconShow = 'ui-icon-triangle-1-s';
				var iconHide = 'ui-icon-triangle-1-e';

				var contentFieldSet = $(this).closest(".fieldset-box").find(
						".fieldset-content");

				if (button.hasClass(iconShow)) { // hide

					button.removeClass(iconShow).addClass(iconHide);
					contentFieldSet.slideUp();
					// button.closest("fieldset").slideUp();

				} else { // show

					button.removeClass(iconHide).addClass(iconShow);
					contentFieldSet.slideDown();
				}
			});

	$("#build_matrix_button").button({}).click(
			function() {
				cinvestav.compu.sendForm(
						cinvestav.compu.constants.URL_FAPARAMS_AND_MATRIX,
						"#fa_form", "#main-content");
				return false;
			});

	$("#string_test_button")
			.button({})
			.click(
					function() {
						
						/*
						var stringToTestInput = $(".string-test-input");						
						stringToTestInput = cinvestav.compu.utils.cleanTokens(stringToTestInput.val(), cinvestav.compu.constants.ALPHABET);							
						stringToTestInput.val(stringToTestInput);
						*/						

						var isValid = true;
						$(".nfa-state-input")
								.each(
										function(index, item) {

											var nfaState = cinvestav.compu.utils
													.cleanTokens($(item).val());
											var currentItem = $(item);

											var isAValidNFAState = cinvestav.compu.utils
													.isAValidStateRepresentation(
															nfaState,
															cinvestav.compu.constants.STATES);
											var messageError = $("#notvalid_nfa");

											if (isAValidNFAState === false) {
												messageError
														.removeClass("invisible");
												messageError
														.find(
																"#notvalid_nfa_errormessage")
														.html(
																"La transición ("
																		+ currentItem
																				.attr("statename")
																		+ ", "
																		+ currentItem
																				.attr("symbolname")
																		+ ")="
																		+ nfaState
																		+ " contiene un estado no válido");
												isValid = false;

												currentItem
														.addClass("dfa-input-error");
												// break the loop
												return false;
											} else {
												messageError
														.addClass("invisible");
												currentItem
														.removeClass("dfa-input-error");
											}

										});

						if (isValid) {

							cinvestav.compu.sendForm(
									cinvestav.compu.constants.URL_FA_TEST,
									"#fa_form", "#main-content");
						}

						return false;
					});

};