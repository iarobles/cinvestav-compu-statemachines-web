cinvestav.compu.templates = {};
cinvestav.compu.templates.CodeTemplateForC = function(){
	
    this.ALPHABET_SIZE_TOKEN = "ALPHABET_SIZE_TOKEN";
    this.ALPHABET_TOKEN = "ALPHABET_TOKEN";
    this.STATES_SIZE_TOKEN = "STATES_SIZE_TOKEN"; 
    this.TRANSITION_MATRIX_TOKEN = "TRANSITION_MATRIX_TOKEN";
    this.INITIAL_STATE_TOKEN = "INITIAL_STATE_TOKEN";
    this.FINAL_STATES_TOKEN = "FINALSTATES_TOKEN";
    this.FINAL_STATES_SIZE_TOKEN = "FINALS_SIZE_TOKEN";
    this.LESSTHAN_SYMBOL = "LESSTHAN_SYMBOL";
    this.GREATHERTHAN_SYMBOL = "GREATHERTHAN_SYMBOL";
	
	this.CODE_TEMPLATE = "\n" +
	"    #include " + this.LESSTHAN_SYMBOL + "stdio.h" + this.GREATHERTHAN_SYMBOL + "\n" +
	"    #include " + this.LESSTHAN_SYMBOL + "string.h" + this.GREATHERTHAN_SYMBOL + "\n" +
	"\n" +
	"    char alphabet[" + this.ALPHABET_SIZE_TOKEN + "] = {" + this.ALPHABET_TOKEN + "};\n" + 
	"    char inputString[100];\n" +    
	"    int transitionMatrix[" + this.STATES_SIZE_TOKEN + "][" + this.ALPHABET_SIZE_TOKEN + "] = {" + this.TRANSITION_MATRIX_TOKEN + "};\n" +
	"    int initialState = " + this.INITIAL_STATE_TOKEN + ";\n" +
	"    int finalStates[" + this.FINAL_STATES_SIZE_TOKEN + "] = {" + this.FINAL_STATES_TOKEN + "};\n" +
	"\n" +
	"    int isInArray(int arraySize, int theArray[], int elementToSearch){\n" +
	"      int index, found = 0;\n" +
	"\n" +
	"      for(index =0; index < arraySize; index++){\n" +
	"         if(elementToSearch == theArray[index]){\n" +
	"            found = 1;\n" +
	"            break;\n" +
	"         }\n" +
	"      }\n" +
	"      \n" +
	"      return found;\n" +
	"    }\n" +
	"\n" +
	"    int getIndexOfSymbol(char symbol){\n" +
	"       int symbolIndex = -1;\n" +
	"       int elementIndex = 0;\n" +
	"       int alphabetSize = strlen(alphabet);\n" +
	"       \n" +
	"       for(elementIndex; elementIndex < alphabetSize; elementIndex++){\n" +
	"     \n" +
	"          if(alphabet[elementIndex]== symbol){\n" +
	"             symbolIndex = elementIndex;\n" +
	"             break;                    \n" +
	"          }\n" +
	"       }   \n" +
	"\n" +
	"       return symbolIndex;\n" +
	"    }\n" +
	"\n" +
	"\n" +
	"    int delta(int stateIndex, char symbol){\n" +    
	"        int symbolIndex;\n" +
	"     \n" +
	"        symbolIndex = getIndexOfSymbol(symbol);\n" +
	"        return transitionMatrix[stateIndex][symbolIndex];\n" +
	"    }      \n" +
	"\n" +
	"    int deltaWord(int stateIndex, char *inputString){\n" +
	"      int inputSize = (int)strlen(inputString);\n" +
	"      int symbolIndex = 0, state = stateIndex;  \n" +
	"\n" +
	"      for(symbolIndex = 0; symbolIndex < inputSize; symbolIndex++){\n" +    
	"           state = delta(state, inputString[symbolIndex]);\n" +
	"      }\n" +
	"\n" +
	"      return state;\n" +
	"    }\n" +
	"\n" +
	"    void main()\n" +
	"    {  \n" +
	"       int inputStringLength, state;\n" +   
	"       int isFinal;\n" +
	"          \n" +
	"       printf(\"introduce la cadena a evaluar(sin espacios y sin comas):\\n\");\n" +
	"       scanf(\"%s\",&inputString);\n" +
	"       \n" +
	"       inputStringLength = (int)strlen(inputString);\n" +
	"       printf(\"La cadena introducida es: %s, su longitud es:%d\\n\", &inputString,inputStringLength);\n" +
	"\n" +
	"       state = deltaWord(initialState, inputString);\n" +
	"       isFinal = isInArray(" + this.FINAL_STATES_SIZE_TOKEN +  ", finalStates, state);\n" +
	"\n" +
	"       if(isFinal){\n" +
	"          printf(\"La DFA acepta a %s\",inputString);\n" +
	"       } else {\n" +
	"          printf(\"La DFA NO acepta a %s\",inputString);\n" +
	"       }\n" +
	"\n" +
	"       printf(\"\\n\");\n" +
	"    }";
	
};