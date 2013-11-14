cinvestav.compu.drawHtml = function(divSelector, htmlResponse) {
	var mainDiv = $(divSelector);

	mainDiv.fadeOut("slow", function() {

		mainDiv.html(htmlResponse);
		mainDiv.fadeIn();

	});
};

cinvestav.compu.hideAndShow = function(cssSelector) {

};

cinvestav.compu.drawError = function(cssSelector, message) {
	var errorBox = $(cssSelector);
	errorBox.find("p").html(message);
	errorBox.fadeIn("slow", function() {
		cinvestav.compu.rollTo(errorBox);
	});
};

cinvestav.compu.renderers = {};
cinvestav.compu.renderers.squareRender = function(r, n) {
	/* the Raphael set is obligatory, containing all you want to display */
	var set = r.set().push(
	/* custom objects go here */
	r.rect(n.point[0] - 30, n.point[1] - 13, 62, 86).attr({
	"fill" : "#fa8",
	"stroke-width" : 2,
	r : "9px"
	})).push(r.text(n.point[0], n.point[1] + 30, n.label).attr({
		"font-size" : "20px"
	}));
	/* custom tooltip attached to the set */
	set.items.forEach(function(el) {
		el.tooltip(r.set().push(r.rect(0, 0, 30, 30).attr({
		"fill" : "#fec",
		"stroke-width" : 1,
		r : "9px"
		})));
	});
	return set;
};

cinvestav.compu.drawENFA = function(containerDivId, theENFA, properties) {

	if (typeof (properties) == "undefined") {
		var properties = {};
	}

	var g = new Graph();
	var source, targets;
	var theAlphabet = theENFA.alphabet.concat([ cinvestav.compu.constants.TOKEN_EPSILON ]);

	// draw states
	for ( var stateIndex = 0; stateIndex < theENFA.states.length; stateIndex++) {
		var state = theENFA.states[stateIndex];
		var stateLabel = (state == theENFA.initialState) ? state + "\n(START)" : state;
		stateLabel = (theENFA.finalStates.indexOf(state) != -1) ? stateLabel + "\n(FINAL)" : stateLabel;
		g.addNode(stateLabel);
	}

	for ( var stateIndex = 0; stateIndex < theENFA.states.length; stateIndex++) {
		source = theENFA.states[stateIndex];
		for ( var symbolIndex = 0; symbolIndex < theAlphabet.length; symbolIndex++) {
			currentSymbol = theAlphabet[symbolIndex];

			if (typeof (theENFA.transitionMatrix[source]) != 'undefined') {
				targets = theENFA.transitionMatrix[source][currentSymbol];
				// target could be null if the transition goes to the EMPTY SET
			} else {
				targets = null;
			}

			if (targets != null && targets != '') {

				if (typeof (targets) == 'string') {// only one state
					targets = [ targets ];
				}

				for ( var targetIndex = 0; targetIndex < targets.length; targetIndex++) {
					var target = targets[targetIndex];

					var sourceLabel = (source == theENFA.initialState) ? source + "\n(START)" : source;
					sourceLabel = (theENFA.finalStates.indexOf(source) != -1) ? sourceLabel + "\n(FINAL)" : sourceLabel;

					var targetLabel = (target == theENFA.initialState) ? target + "\n(START)" : target;
					targetLabel = (theENFA.finalStates.indexOf(target) != -1) ? targetLabel + "\n(FINAL)" : targetLabel;

					if (source != target) {

						currentSymbol = (currentSymbol == cinvestav.compu.constants.TOKEN_EPSILON) ? "eps" : currentSymbol;
						g.addEdge(sourceLabel, targetLabel, {
						label : currentSymbol,
						directed : true
						});

					} else if (source == target && currentSymbol != cinvestav.compu.constants.TOKEN_EPSILON) {

						g.addEdge(sourceLabel, targetLabel, {
						label : currentSymbol,
						directed : true
						});
					}
				}

			}
		}
	}

	/* layout the graph using the Spring layout implementation */
	var layouter = new Graph.Layout.Spring(g);
	layouter.layout();

	/* draw the graph using the RaphaelJS draw implementation */
	var theWidth = (properties.width) ? properties.width : $("#" + containerDivId).width();
	var theHeight = (properties.height) ? properties.height : $("#" + containerDivId).height();

	var renderer = new Graph.Renderer.Raphael(containerDivId, g, theWidth, theHeight);
	renderer.draw();
};

cinvestav.compu.drawCYKTable = function(cssSelector, cykResult) {

	var emptyCell = '<td class="border-none"></td>';
	var theTable = "<table>";
	var wordLength = cykResult.word.length;

	for ( var row = 0; row < 3; row++) {

		theTable = theTable + "<tr>";
		for ( var column = 0; column < wordLength; column++) {
			theTable = (column == 0) ? theTable + emptyCell : theTable;

			switch (row) {
			case 0:

				theTable = theTable + '<td class="border-none"><strong>' + cykResult.word[column] + "<strong></td>";
				break;
			case 1:

				theTable = theTable + emptyCell;
				break;
			case 2:

				theTable = theTable + '<td class="border-none">' + (column + 1) + "</td>";
				break;
			}
		}
		theTable = theTable + "</tr>";
	}

	for ( var row = 0; row < wordLength; row++) {

		var maxColumn = wordLength - row - 1;
		theTable = theTable + "<tr>";
		for ( var column = 0; column < wordLength; column++) {

			if (column <= maxColumn) {
				theTable = (column == 0) ? theTable + '<td class="border-none">' + (row + 1) + "</td>" : theTable;
				var cykItems = cykResult.cykTable[row + 1][column + 1];
				var variables = [];
				for ( var itemIndex = 0; itemIndex < cykItems.length; itemIndex++) {
					variables = variables.concat(cykItems[itemIndex].variables);
				}
				variables = variables.unique();

				var cykElement = (variables.length == 0) ? "&empty;" : cinvestav.compu.utils.arrayToString(variables, ",");
				theTable = theTable + '<td>' + cykElement + "</td>";
			} else {
				theTable = theTable + emptyCell;
			}
		}

		theTable = theTable + "</tr>";
	}

	theTable = theTable + "</table>";

	$(cssSelector).html(theTable);
};

cinvestav.compu.drawFATransitionMatrix = function(cssSelector, theFA, properties) {

	var isENFA = (typeof (theFA.transitionMatrix[theFA.initialState][cinvestav.compu.constants.TOKEN_EPSILON]) != 'undefined') ? true : false;
	var states = theFA.states;
	var alphabet = (isENFA) ? theFA.alphabet.concat(cinvestav.compu.constants.TOKEN_EPSILON) : theFA.alphabet;

	// private function?
	var alphabetIndex = 0;
	var stateIndex = 0;
	// TODO: mover esta etiqueta a otra lado
	var transitionMatrix = "<p>Estado Incial:<strong>" + theFA.initialState + "</strong><br/>Estados Finales:<strong>" + cinvestav.compu.utils.arrayToString(theFA.finalStates, ",") + "</strong><br/></p>";
	transitionMatrix = transitionMatrix + "<table class=\"transition-matrix-nfa\">";
	transitionMatrix = transitionMatrix + "<thead><tr><th>\\</th>";
	for (alphabetIndex = 0; alphabetIndex < alphabet.length; alphabetIndex++) {
		var currentSymbol = alphabet[alphabetIndex];
		currentSymbol = (isENFA == true && currentSymbol == cinvestav.compu.constants.TOKEN_EPSILON) ? "&epsilon;" : currentSymbol;
		transitionMatrix = transitionMatrix + "<th>" + currentSymbol + "</th>";
	}

	transitionMatrix = transitionMatrix + "</tr></thead>";
	transitionMatrix = transitionMatrix + "<tbody>";

	for (stateIndex = 0; stateIndex < states.length; stateIndex++) {
		var currentState = states[stateIndex];
		transitionMatrix = transitionMatrix + "<tr><td><strong>" + currentState + "<strong></td>";

		for (alphabetIndex = 0; alphabetIndex < alphabet.length; alphabetIndex++) {
			var currentSymbol = alphabet[alphabetIndex];
			var theTransitions = theFA.transitionMatrix[currentState][currentSymbol];

			if (typeof (theTransitions) != 'string') {
				theTransitions = cinvestav.compu.utils.arrayToString(theTransitions);
				theTransitions = (theTransitions.length == 0) ? "&empty;" : theTransitions;
				theTransitions = "{" + theTransitions + "}";
			}

			transitionMatrix = transitionMatrix + "<td>" + theTransitions + "</td>";

		}

		transitionMatrix = transitionMatrix + "</tr>";
	}

	transitionMatrix = transitionMatrix + "</tbody></table>";

	$(cssSelector).html(transitionMatrix);

};

cinvestav.compu.drawFieldSetButtons = function(cssSelector) {

	if (typeof (cssSelector) == 'undefined') {
		var cssSelector = ".fieldset-button";
	}

	$(cssSelector).button({
	icons : {
		primary : 'ui-icon-triangle-1-s'
	},
	text : '',
	}).click(function() {
		var button = $(this).find(".ui-button-icon-primary");
		var iconShow = 'ui-icon-triangle-1-s';
		var iconHide = 'ui-icon-triangle-1-e';

		var contentFieldSet = $(this).closest(".fieldset-box").find(".fieldset-content");

		if (button.hasClass(iconShow)) { // hide

			button.removeClass(iconShow).addClass(iconHide);
			contentFieldSet.slideUp();
			// button.closest("fieldset").slideUp();

		} else { // show

			button.removeClass(iconHide).addClass(iconShow);
			contentFieldSet.slideDown();
		}
	});
};

cinvestav.compu.drawFieldsetDFATransitionMatrix = function(divToDraw, states, alphabet) {
	var fieldsetBox = $(divToDraw);

	// seach content box and replace its content with the transition matrix
	fieldsetBox.find(".fieldset-content").html(cinvestav.compu.buildDFATransitionMatrix(states, alphabet));
};

cinvestav.compu.drawFieldsetInitialState = function(targetDiv, states, options) {
	var targetBox = $(targetDiv);

	targetBox.find(".form-col-right").html(cinvestav.compu.buildCombo(states, options));

};

cinvestav.compu.drawFieldsetFinalStates = function(targetDiv, states) {
	var targetBox = $(targetDiv);
	// fill the right column of the field set with the final states
	targetBox.find(".form-col-right").html(cinvestav.compu.buildFinalStates(states));

};

cinvestav.compu.drawFieldsetRegExpContent = function(theParentBox, dfa, simplifyRegExp) {

	var theRegExpBox = $(theParentBox);
	var theDFA = dfa;
	var simplifyExp = simplifyRegExp;
	// console.debug("simplifyExp:" + simplifyRegExp);
	theRegExpBox.fadeOut("slow", function() {

		var theTable = cinvestav.compu.buildDFARegExpTable(theDFA, simplifyExp);
		var finalRegExp = cinvestav.compu.buildDFAFinalRegExp(theDFA, simplifyExp);

		theRegExpBox.find(".final-regexp").html(finalRegExp);
		theRegExpBox.find(".table-regexp").html(theTable);
		theRegExpBox.fadeIn();
	});
};

cinvestav.compu.buildCombo = function(theArray, options) {
	var elementIndex = 0;

	// options for state combo (always are the same states)
	var theCombo = "";
	for (elementIndex = 0; elementIndex < theArray.length; elementIndex++) {
		if (theCombo == "") {
			theCombo = theCombo + "<option selected=\"selected\" value=\"" + theArray[elementIndex] + "\">" + theArray[elementIndex] + "</option>";
		} else {
			theCombo = theCombo + "<option value=\"" + theArray[elementIndex] + "\">" + theArray[elementIndex] + "</option>";
		}
	}

	if (typeof (options) != 'undefined') {
		var comboHeader = "<select ";

		if (options.id) {
			comboHeader = comboHeader + " id=\"" + options.id + "\" ";
		}

		if (options.name) {
			comboHeader = comboHeader + " name=\"" + options.name + "\" ";
		}

		if (options.class) {
			comboHeader = comboHeader + " class=\"" + options.class + "\" ";
		}

		comboHeader = comboHeader + " >";

	} else {
		comboHeader = "<select>";
	}

	return comboHeader + theCombo + "</select>";
};

// private?
cinvestav.compu.buildDFAFinalRegExp = function(dfa, simplifyEnabled) {

	var finalRegExp = "";

	var regExpFindEmptyToken = new RegExp(cinvestav.compu.constants.TOKEN_EMPTY_SET, "g");
	var regExpFindEpsilonToken = new RegExp(cinvestav.compu.constants.TOKEN_EPSILON, "g");

	finalRegExp = dfa.equivalentRegExp(simplifyEnabled);
	finalRegExp = finalRegExp.replace(regExpFindEmptyToken, "&empty;");
	finalRegExp = finalRegExp.replace(regExpFindEpsilonToken, "&epsilon;");

	return finalRegExp;
};

// private?
cinvestav.compu.buildDFARegExpTable = function(dfa, simplifyEnabled) {

	var regExpFindEmptyToken = new RegExp(cinvestav.compu.constants.TOKEN_EMPTY_SET, "g");
	var regExpFindEpsilonToken = new RegExp(cinvestav.compu.constants.TOKEN_EPSILON, "g");
	var theTable = "";

	theTable = "<table>";
	theTable = theTable + "<thead><tr>";
	theTable = theTable + "<th>\\</th>";

	var k = 0;
	// build headers
	for (k = 0; k <= dfa.states.length; k++) {
		theTable = theTable + "<th>k=" + k + "</th>";
	}
	theTable = theTable + "</tr></thead>";

	// build all rows
	theTable = theTable + "<tbody>";

	var i = 1;
	var j = 1;
	var k = dfa.states.length;
	for (i = 0; i < dfa.states.length; i++) {
		for (j = 0; j < dfa.states.length; j++) {

			theTable = theTable + "<tr>";
			theTable = theTable + "<td><strong>r<sup>k</sup><sub>" + (i + 1) + "," + (j + 1) + "</sub></strong></td>";
			// 0 exists as a state (due the zero index of the array) so a little
			// change
			// in notation is needed
			// with k=-1
			for (k = -1; k < dfa.states.length; k++) {
				// console.debug("simplifyEnabled:" + simplifyEnabled);
				var theRegExp = dfa.toRegExp(i, j, k, simplifyEnabled);

				// console.debug("theRegExp(before):" + theRegExp);
				theRegExp = theRegExp.replace(regExpFindEmptyToken, "&empty;");
				theRegExp = theRegExp.replace(regExpFindEpsilonToken, "&epsilon;");
				// console.debug("theRegExp(after):" + theRegExp);

				theTable = theTable + "<td>" + theRegExp + "</td>";
			}
			theTable = theTable + "</tr>";
		}
	}

	theTable = theTable + "</tbody></table>";

	return theTable;
};

// private function?
cinvestav.compu.buildTransitionMatrix = function(states, alphabet, elementPerStateAndSymbol) {

	var alphabetIndex = 0;
	var stateIndex = 0;
	var transitionMatrix = "<table class=\"transition-matrix-dfa\">";
	transitionMatrix = transitionMatrix + "<thead><tr><th>\\</th>";
	for (alphabetIndex = 0; alphabetIndex < alphabet.length; alphabetIndex++) {
		transitionMatrix = transitionMatrix + "<th>" + alphabet[alphabetIndex] + "</th>";
	}

	transitionMatrix = transitionMatrix + "</tr></thead>";
	transitionMatrix = transitionMatrix + "<tbody>";

	for (stateIndex = 0; stateIndex < states.length; stateIndex++) {
		transitionMatrix = transitionMatrix + "<tr><td><strong>" + states[stateIndex] + "<strong></td>";
		for (alphabetIndex = 0; alphabetIndex < alphabet.length; alphabetIndex++) {

			transitionMatrix = transitionMatrix + "<td><select name=\"transitionMatrix[" + states[stateIndex] + "][" + alphabet[alphabetIndex] + "]\" class=\"transition-matrix-combobox\">" + elementPerStateAndSymbol + "</select></td>";
		}

		transitionMatrix = transitionMatrix + "</tr>";
	}

	transitionMatrix = transitionMatrix + "</tbody></table>";

	return transitionMatrix;
};

// private function?
cinvestav.compu.buildDFATransitionMatrix = function(states, alphabet) {
	var stateIndex = 0;
	// options for state combo (always are the same states)
	var stateCombo = "";
	for (stateIndex = 0; stateIndex < states.length; stateIndex++) {
		if (stateCombo == "") {
			stateCombo = stateCombo + "<option selected=\"selected\" value=\"" + states[stateIndex] + "\">" + states[stateIndex] + "</option>";
		} else {
			stateCombo = stateCombo + "<option value=\"" + states[stateIndex] + "\">" + states[stateIndex] + "</option>";
		}
	}

	return cinvestav.compu.buildTransitionMatrix(states, alphabet, stateCombo);
};

cinvestav.compu.buildFinalStates = function(states) {
	var stateIndex = 0;
	var finalStates = "";
	for (stateIndex = 0; stateIndex < states.length; stateIndex++) {
		finalStates = finalStates + states[stateIndex] + "<input type=\"checkbox\" name=\"finalStates\" value=\"" + states[stateIndex] + "\" />";
	}

	return finalStates;
};