package cinvestav.compu.statemachines.spring.forms;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class CompleteDFAForm extends BasicDFAForm {
    
    @Size(max = 300)
    String stringToTest = "";

    //int[][] transitionMatrix = { { 1, 2 }, { 3, 4 } };

    @NotNull
    Integer initialState = 0;

    @NotNull
    @Size(min = 1, max = 30)
    Integer[] finalStates;

    Boolean isAcceptable;

    public CompleteDFAForm() {

    }

    public CompleteDFAForm(BasicDFAForm dfaForm) {
        this.alphabet = dfaForm.getAlphabet();
        this.alphabetAsString = dfaForm.getAlphabetAsString();
        this.alphabetLength = dfaForm.getAlphabetLength();
        this.states = dfaForm.getStates();
        this.statesAsString = dfaForm.getStatesAsString();
        this.totalStates = dfaForm.getTotalStates();
        this.isAjax = dfaForm.getIsAjax();
        this.includeDFARepresentation = dfaForm.getIncludeDFARepresentation();
    }

    public String toString() {
        StringBuilder builder;

        builder = new StringBuilder();
        builder.append("[");
        addParameters(builder);
        builder.append("]");

        return builder.toString();
    }

    protected void addParameters(StringBuilder builder) {

        super.addParameters(builder);
        builder.append(", ");
        //builder.append("initialState:").append(initialState).append(", ");
        builder.append("finalStates:").append(arrayToList(finalStates)).append(", ");
        builder.append("isAcceptable:").append(isAcceptable).append(", ");
        builder.append("stringToTest:").append(stringToTest);
    }

    public String getStringToTest() {
        return stringToTest;
    }

    public void setStringToTest(String stringToTest) {
        this.stringToTest = stringToTest;
    }

    /*
    public int[][] getTransitionMatrix() {
        return transitionMatrix;
    }

    public void setTransitionMatrix(int[][] transitionMatrix) {
        this.transitionMatrix = transitionMatrix;
    }*/

    public Integer getInitialState() {
        return initialState;
    }

    public void setInitialState(Integer initialState) {
        this.initialState = initialState;
    }

    public Integer[] getFinalStates() {
        return finalStates;
    }

    public void setFinalStates(Integer[] finalStates) {
        this.finalStates = finalStates;
    }

    public Boolean getIsAcceptable() {
        return isAcceptable;
    }

    public void setIsAcceptable(Boolean isAcceptable) {
        this.isAcceptable = isAcceptable;
    }

}
