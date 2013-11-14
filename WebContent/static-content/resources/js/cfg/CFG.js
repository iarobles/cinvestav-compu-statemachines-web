cinvestav.compu.cfg = {};

cinvestav.compu.cfg.CYKResult = function(word, startSymbol, cykTable) {
	this.word = word;
	this.startSymbol = startSymbol;
	this.cykTable = cykTable;

	this.getLeftDerivationsByCYKNode = function(cykNode) {

		var derivations = [];
		var rightSymbolDerivations = [];
		var finalDerivations = [];
		// the variable
		var currentNodeRule = [ cykNode.production[1] ];

		// get left derivations of its childs
		if (cykNode.leftSymbol != null) {

			// process left symbol and all its childrens
			for ( var leftChildIndex = 0; leftChildIndex < cykNode.leftChilds.length; leftChildIndex++) {
				var aLeftChild = cykNode.leftChilds[leftChildIndex];
				var leftChildDerivations = this.getLeftDerivationsByCYKNode(aLeftChild);

				for ( var childDerivationIndex = 0; childDerivationIndex < leftChildDerivations.length; childDerivationIndex++) {
					var aChildDerivation = leftChildDerivations[childDerivationIndex];
					for ( var subDerivationIndex = 0; subDerivationIndex < aChildDerivation.length; subDerivationIndex++) {

						var subDerivation = aChildDerivation[subDerivationIndex];
						subDerivation = subDerivation.concat(cykNode.rightSymbol);
						aChildDerivation[subDerivationIndex] = subDerivation;
					}

					// at the begginning of the rule
					aChildDerivation = currentNodeRule.concat(aChildDerivation);
					leftChildDerivations[childDerivationIndex] = aChildDerivation;
				}

				derivations = derivations.concat(leftChildDerivations);
			}

			// process right symbol
			for ( var rightChildIndex = 0; rightChildIndex < cykNode.leftChilds.length; rightChildIndex++) {
				var aRightChild = cykNode.rightChilds[rightChildIndex];
				var rightChildDerivations = this.getLeftDerivationsByCYKNode(aRightChild);

				rightSymbolDerivations = rightSymbolDerivations.concat(rightChildDerivations);
			}

			// finally make cartesian product

			for ( var derivationIndex = 0; derivationIndex < derivations.length; derivationIndex++) {
				var arrayOfDerivations = derivations[derivationIndex];

				var lastDerivation = arrayOfDerivations[arrayOfDerivations.length - 1];
				lastDerivation = lastDerivation.replace(cykNode.rightSymbol, "");

				for ( var rightDerivationIndex = 0; rightDerivationIndex < rightSymbolDerivations.length; rightDerivationIndex++) {

					var aRightDerivation = rightSymbolDerivations[rightDerivationIndex];
					var completeRightDerivation = [];

					for ( var subDerivationIndex = 0; subDerivationIndex < aRightDerivation.length; subDerivationIndex++) {
						completeRightDerivation[subDerivationIndex] = lastDerivation + aRightDerivation[subDerivationIndex];
					}

					var finalDerivation = derivations[derivationIndex].concat(completeRightDerivation);
					finalDerivations.push(finalDerivation);
				}
			}

		} else {
			finalDerivations.push(currentNodeRule);//
		}

		return finalDerivations;
	};

	this.getDerivations = function() {

		var cykTree = this.createCYKTree();
		var derivations = [];

		for ( var indexChild = 0; indexChild < cykTree.childs.length; indexChild++) {
			var theChildNode = cykTree.childs[indexChild];

			var childDerivations = this.getLeftDerivationsByCYKNode(theChildNode);
			derivations = derivations.concat(childDerivations);
		}

		var startDerivation = [ this.startSymbol ];
		for ( var derivationIndex = 0; derivationIndex < derivations.length; derivationIndex++) {
			derivations[derivationIndex] = startDerivation.concat(derivations[derivationIndex]);
		}

		return derivations;
	};

	this.createCYKTree = function() {

		var theTree = new cinvestav.compu.cfg.CYKRootNode(this.startSymbol);

		theTree.childs = this.getCYKNodeChilds(this.startSymbol, [ this.word.length, 1 ]);

		return theTree;
	};

	this.getCYKNodeChilds = function(theVariable, position) {
		var nodeChilds = [];

		var cykItems = this.cykTable[position[0]][position[1]];

		for ( var itemIndex = 0; itemIndex < cykItems.length; itemIndex++) {

			var cykItem = cykItems[itemIndex];
			var theProductions = cykItem.findProductionsByVariable(theVariable);

			for ( var productionIndex = 0; productionIndex < theProductions.length; productionIndex++) {

				var currentProduction = theProductions[productionIndex];
				var cykNode = new cinvestav.compu.cfg.CYKNode({
				production : currentProduction,
				leftPosition : cykItem.leftPosition,
				rightPosition : cykItem.rightPosition,
				leftSymbol : cykItem.leftSymbol,
				rightSymbol : cykItem.rightSymbol
				});

				if (cykNode.leftPosition != null) {
					var leftChilds = this.getCYKNodeChilds(cykNode.leftSymbol, cykNode.leftPosition);
					var rightChilds = this.getCYKNodeChilds(cykNode.rightSymbol, cykNode.rightPosition);

					cykNode.leftChilds = leftChilds;
					cykNode.rightChilds = rightChilds;
				}

				nodeChilds.push(cykNode);
			}
		}

		return nodeChilds;
	};

};

cinvestav.compu.cfg.CYKItem = function(productions, leftPosition, rightPosition, leftSymbol, rightSymbol) {
	this.productions = productions;
	this.rightPosition = rightPosition;
	this.leftPosition = leftPosition;
	this.leftSymbol = leftSymbol;
	this.rightSymbol = rightSymbol;

	// initialization
	this.variables = [];
	for ( var productionIndex = 0; productionIndex < this.productions.length; productionIndex++) {
		this.variables.push(this.productions[productionIndex][0]);
	}

	this.variables = this.variables.unique();

	this.toString = function() {
		return "s";
	};

	this.findProductionsByVariable = function(theSymbol) {
		var productionsFound = [];

		for ( var productionIndex = 0; productionIndex < this.productions.length; productionIndex++) {
			var theCurrentProduction = this.productions[productionIndex];

			if (theCurrentProduction[0] == theSymbol) {
				productionsFound.push(theCurrentProduction);
			}
		}

		return productionsFound;
	};
};

cinvestav.compu.cfg.CYKRootNode = function(startSymbol) {
	this.startSymbol = startSymbol;
	this.childs = [];
};

cinvestav.compu.cfg.CYKNode = function(parameters) {
	this.production = parameters.production;
	this.leftPosition = parameters.leftPosition;
	this.rightPosition = parameters.rightPosition;
	this.leftSymbol = parameters.leftSymbol;
	this.rightSymbol = parameters.rightSymbol;
	this.leftChilds = [];
	this.rightChilds = [];
};

cinvestav.compu.cfg.CFG = function(variables, terminals, productions, startSymbol) {
	this.variables = variables;
	this.terminals = terminals;
	this.productions = productions;
	this.startSymbol = startSymbol;

	this.searchProductionsByRule = function(ruleAsString) {

		var productions = [];
		for ( var variableIndex = 0; variableIndex < this.variables.length; variableIndex++) {
			var variable = this.variables[variableIndex];
			var rulesPerVariable = this.productions[variable];

			if (rulesPerVariable != null) {

				for ( var ruleIndex = 0; ruleIndex < rulesPerVariable.length; ruleIndex++) {
					var rule = rulesPerVariable[ruleIndex];

					if (rule == ruleAsString) {
						productions.push([ variable, rule ]);
					}

				}
			}
		}

		return productions;
	};

	this.getCYKVariables = function(cykItems) {

		var variables = [];

		for ( var cykItemIndex = 0; cykItemIndex < cykItems.length; cykItemIndex++) {
			var cykItem = cykItems[cykItemIndex];

			variables = variables.concat(cykItem.variables);
		}

		variables = variables.unique();

		return variables;
	};

	// get derivations using CYK
	// VIJ = Vij from Hopcroft page 140
	this.executeCYK = function(theWord) {
		var VIJ = {};
		var wordLength = theWord.length;

		// steps 1 and 2
		VIJ[1] = {};
		for ( var symbolIndex = 0; symbolIndex < wordLength; symbolIndex++) {

			var productions = this.searchProductionsByRule(theWord[symbolIndex]);
			VIJ[1][symbolIndex + 1] = [ new cinvestav.compu.cfg.CYKItem(productions, null, null, null, null) ];
		}

		// step 3
		for ( var j = 2; j <= wordLength; j++) {
			// step 4
			VIJ[j] = {};
			for ( var i = 1; i <= (wordLength - j + 1); i++) {

				// step 5
				VIJ[j][i] = []; // array of cyk items

				// step 6
				for ( var k = 1; k <= (j - 1); k++) {

					// step 7
					var leftSymbols = this.getCYKVariables(VIJ[k][i]);
					var rightSymbols = this.getCYKVariables(VIJ[j - k][i + k]);

					for ( var leftIndex = 0; leftIndex < leftSymbols.length; leftIndex++) {

						for ( var rightIndex = 0; rightIndex < rightSymbols.length; rightIndex++) {

							var leftSymbol = leftSymbols[leftIndex];
							var rightSymbol = rightSymbols[rightIndex];
							var theRule = leftSymbol + "" + rightSymbol;

							var productions = this.searchProductionsByRule(theRule);
							if (productions != null && productions.length > 0) {

								var theCYKItem = new cinvestav.compu.cfg.CYKItem(productions, [ k, i ], [ j - k, i + k ], leftSymbol, rightSymbol);
								VIJ[j][i].push(theCYKItem);
							}
						}
					}

				}

			}
		}

		return new cinvestav.compu.cfg.CYKResult(theWord, this.startSymbol, VIJ);
	};

};