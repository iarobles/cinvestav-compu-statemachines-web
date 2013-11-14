$(function() {

	var chomskyVariableRegExp = null;
	var chomskyTerminalRegExp = null;
	var chomskyPosibleRules = null;
	var variables = null;
	var terminals = null;
	var startSymbol = null;
	var widgetID = 0;

	cinvestav.compu.drawFieldSetButtons();

	function findNotValidChomskyProduction(tokenizedProduction, variablesRegExp, terminalsRegExp) {

		var productions = tokenizedProduction.split("|");
		var notValidProduction = null;

		for ( var productionIndex = 0; productionIndex < productions.length; productionIndex++) {
			var production = productions[productionIndex];
			var isValid = (variablesRegExp.exec(production) != null);

			// productions should be terminals
			// otherwise is a wrong production
			if (!isValid) {
				var isValid = (terminalsRegExp.exec(production) != null);

				if (!isValid) {
					notValidProduction = production;
					break;
				}

			}
		}

		return notValidProduction;

	}

	function drawProduction(cssSelector, variablesArray, posibleRules, deleteButtonEnabled) {

		var htmlContent = "";

		widgetID++;
		var variablesComboId = "production_combo" + widgetID;

		widgetID++;
		var mainBoxId = "single_cfg_production_" + widgetID;

		htmlContent = '<div id="' + mainBoxId + '" + class="form-row production-input invisible">';
		htmlContent = htmlContent + '<div class="form-col-left">';
		htmlContent = htmlContent + cinvestav.compu.buildCombo(variablesArray, {
		id : variablesComboId,
		class : "production-variable"
		}) + "&rarr;";
		htmlContent = htmlContent + '</div>';

		htmlContent = htmlContent + '<div class="form-col-right">';

		widgetID++;
		var rulesComboId = "production_combo_" + widgetID;

		htmlContent = htmlContent + cinvestav.compu.buildCombo(posibleRules, {
		id : rulesComboId,
		class : "production-rule"
		});

		if (deleteButtonEnabled) {
			htmlContent = htmlContent + '<img src="resources/img/icons/delete.png" class="remove-production" />';
		}

		htmlContent = htmlContent + '<img src="resources/img/icons/add.png" class="add-production" />';

		htmlContent = htmlContent + '</div><div class="clear"></div></div>';

		$(cssSelector).after(htmlContent);

		$("#" + variablesComboId).combobox({
			inputCss : 'transition-matrix-combobox'
		});

		$("#" + rulesComboId).combobox({
			inputCss : 'transition-matrix-combobox'
		});

		$("#" + mainBoxId).fadeIn();
	}

	$(".add-production").live("click", function() {
		var theParent = $(this).parent().parent();

		drawProduction(theParent, variables, chomskyPosibleRules, true);
	});

	$(".remove-production").live("click", function() {
		var currentProduction = $(this).parent().parent();
		currentProduction.fadeOut(function() {
			currentProduction.remove();
		});

	});

	$("#cyk_form").submit(function() {
		return false;
	});

	$("#build_cyk_productions").button().click(function() {

		var theForm = $("#cyk_form");
		variables = theForm.find("input[name=variables]").val();
		variables = cinvestav.compu.utils.cleanTokens(variables);
		variables = variables.split(",");

		terminals = theForm.find("input[name=terminals]").val();
		terminals = cinvestav.compu.utils.cleanTokens(terminals);
		terminals = terminals.split(",");

		startSymbol = theForm.find("input[name=startSymbol]").val();
		startSymbol = cinvestav.compu.utils.cleanTokens(startSymbol, variables);

		if (variables.length == 0) {

			cinvestav.compu.drawError("#error_basicparams", cinvestav.compu.constants.ERROR_EMPTY_VARIABLES);

		} else if (terminals.length == 0) {
			cinvestav.compu.drawError("#error_basicparams", cinvestav.compu.constants.ERROR_EMPTY_TERMINALS);
		} else if (startSymbol.length == 0) {
			cinvestav.compu.drawError("#error_basicparams", cinvestav.compu.constants.ERROR_EMPTY_START_SYMBOL);
		} else {
			$("#error_basicparams").fadeOut();
		}

		var tokenizedVariables = cinvestav.compu.utils.arrayToString(variables, "|");
		var tokenizedTerminals = cinvestav.compu.utils.arrayToString(terminals, "|");

		chomskyVariableRegExp = new RegExp("^(" + tokenizedVariables + "){2,2}$");
		chomskyTerminalRegExp = new RegExp("^(" + tokenizedTerminals + ")$");

		// build all posible rules in order to use them
		// to build the combo box for productions

		chomskyPosibleRules = [];
		for ( var leftVariableIndex = 0; leftVariableIndex < variables.length; leftVariableIndex++) {
			for ( var rightVariableIndex = 0; rightVariableIndex < variables.length; rightVariableIndex++) {
				var production = variables[leftVariableIndex] + variables[rightVariableIndex];
				chomskyPosibleRules.push(production);
			}
		}

		for ( var terminalIndex = 0; terminalIndex < terminals.length; terminalIndex++) {
			chomskyPosibleRules.push(terminals[terminalIndex]);
		}

		$("#cfg_productions").fadeOut(function() {

			var theProductionContent = $("#productions_content");

			theProductionContent.find(".production-input").remove();
			var productionBox = theProductionContent.find(".production-start");
			drawProduction(productionBox, variables, chomskyPosibleRules, false);

			$("#cfg_productions").fadeIn(function() {

			});
		});
		
		$("#derivations_error").fadeOut();

		$("#cfg_derivations").fadeOut(function() {

			// clean all previous results
			$(".cyk-derivations-content").html("");
			$(".cyk-table-content").html("");
			$(".cyk-derivation-title").addClass("invisible");			
			$("#stringToTest").val("");
			
			$("#cfg_derivations").fadeIn();
		});

		return false;
	});

	$("#string_test_button").button().click(function() {

		var stringToTest = $("#stringToTest").val();
		stringToTest = cinvestav.compu.utils.cleanTokens(stringToTest);

		if (stringToTest.length == 0) {
			cinvestav.compu.drawError("#derivations_error", cinvestav.compu.constants.ERROR_EMPTY_TEST_STRING);
		} else {

			var notValidTerminals = cinvestav.compu.utils.findNotValidSymbols(stringToTest, terminals);

			if (notValidTerminals.length > 0) {

				for ( var indexSymbol = 0; indexSymbol < notValidTerminals.length; indexSymbol++) {
					notValidTerminals[indexSymbol] = "\"" + notValidTerminals[indexSymbol] + "\"";
				}

				var notValidTerminalsAsString = "<strong>" + cinvestav.compu.utils.arrayToString(notValidTerminals, ",") + "</strong>";
				cinvestav.compu.drawError("#derivations_error", cinvestav.compu.constants.ERROR_NOT_VALID_TERMINALS + notValidTerminalsAsString);
			} else {
				var stringAsArray = [];

				// TODO: include comma separated strings!!
				if (stringToTest.indexOf(",") != -1) {
					stringAsArray = stringToTest.split(",");
				} else {
					stringAsArray = stringToTest.split("");
				}

				// terminals and variables are global
				// and startSymbol
				var productions = {};
				$(".production-input").each(function(index, theProduction) {
					theProduction = $(theProduction);
					var productionVariable = theProduction.find(".production-variable").val();
					var productionRule = theProduction.find(".production-rule").val();

					if (productions[productionVariable] == null) {
						productions[productionVariable] = [];
					}

					if (productions[productionVariable][productionRule] == null) {
						productions[productionVariable].push(productionRule);
					}

				});

				// clean all previous results
				$(".cyk-derivations-content").html("");
				$(".cyk-table-content").html("");
				$(".cyk-derivation-title").removeClass("invisible");

				debugger;
				var theGrammar = new cinvestav.compu.cfg.CFG(variables, terminals, productions, startSymbol);

				var cykResult = theGrammar.executeCYK(stringAsArray);
				cinvestav.compu.drawCYKTable(".cyk-table-content", cykResult);

				var derivations = cykResult.getDerivations();
				debugger;

				if (derivations.length > 0) {

					var derivationsHtml = '<ul>';

					for ( var rowNumber = 0; rowNumber < derivations.length; rowNumber++) {
						var aDerivation = derivations[rowNumber];
						var derivationLength = aDerivation.length;

						var currentDerivation = "";
						for ( var columnNumber = 0; columnNumber < derivationLength; columnNumber++) {

							if (columnNumber == 0) {
								currentDerivation = aDerivation[columnNumber];
							} else {
								currentDerivation = currentDerivation + "&rarr;" + aDerivation[columnNumber];
							}
						}

						derivationsHtml = derivationsHtml + "<li>" + currentDerivation + '</li>';
					}

					derivationsHtml = derivationsHtml + '</ul>';

					$("#derivations_error").fadeOut();
					$(".cyk-derivations-content").html(derivationsHtml);

				} else {

					cinvestav.compu.drawError("#derivations_error", cinvestav.compu.constants.ERROR_NO_DERIVATIONS_FOR_STRING);
				}
			}
		}

	});

});