package cinvestav.compu.statemachines.spring.forms;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class BasicDFAForm {

    @NotNull
    @Min(1)
    @Max(100)
    protected Integer totalStates;

    @NotNull
    @Min(1)
    @Max(100)
    protected Integer alphabetLength;

    @Size(max = 300)
    protected String statesAsString;

    @Size(max = 300)
    protected String alphabetAsString;

    protected Boolean includeDFARepresentation = true;

    protected String[] alphabet;

    protected String[] states;

    protected Boolean isAjax = false;

    protected <T> List<T> arrayToList(T[] array) {
        List<T> theList;

        if (array != null) {
            theList = Arrays.asList(array);
        } else {
            theList = new ArrayList<T>();
        }

        return theList;
    }

    protected void addParameters(StringBuilder builder) {

        builder.append("isAjax:").append(isAjax).append(", ");
        builder.append("totalStates:").append(totalStates).append(", ");
        builder.append("alphabetLength:").append(alphabetLength).append(", ");
        builder.append("includeDFARepresentation:").append(includeDFARepresentation).append(", ");
        builder.append("statesAsString:").append(statesAsString).append(", ");
        builder.append("alphabetAsString:").append(alphabetAsString).append(", ");
        builder.append("alphabet:").append(arrayToList(alphabet)).append(", ");
        builder.append("states:").append(arrayToList(states));

    }

    public String toString() {
        StringBuilder builder;

        builder = new StringBuilder();
        builder.append("[");
        addParameters(builder);
        builder.append("]");

        return builder.toString();
    }

    public Integer getTotalStates() {
        return totalStates;
    }

    public void setTotalStates(Integer totalStates) {
        this.totalStates = totalStates;
    }

    public Integer getAlphabetLength() {
        return alphabetLength;
    }

    public void setAlphabetLength(Integer alphabetLength) {
        this.alphabetLength = alphabetLength;
    }

    public String[] getAlphabet() {
        return alphabet;
    }

    public void setAlphabet(String[] alphabet) {
        this.alphabet = alphabet;
    }

    public String[] getStates() {
        return states;
    }

    public void setStates(String[] states) {
        this.states = states;
    }

    public String getStatesAsString() {
        return statesAsString;
    }

    public void setStatesAsString(String statesAsString) {
        this.statesAsString = statesAsString;
    }

    public String getAlphabetAsString() {
        return alphabetAsString;
    }

    public void setAlphabetAsString(String alphabetAsString) {
        this.alphabetAsString = alphabetAsString;
    }

    public Boolean getIncludeDFARepresentation() {
        return includeDFARepresentation;
    }

    public void setIncludeDFARepresentation(Boolean includeDFARepresentation) {
        this.includeDFARepresentation = includeDFARepresentation;
    }

    
    public Boolean getIsAjax() {
        return isAjax;
    }

    
    public void setIsAjax(Boolean isAjax) {
        this.isAjax = isAjax;
    }

}
