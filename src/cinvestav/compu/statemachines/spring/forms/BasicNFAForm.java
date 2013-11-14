package cinvestav.compu.statemachines.spring.forms;

public class BasicNFAForm extends BasicDFAForm {

    protected boolean includeDFARepresentation;

    protected void addParameters(StringBuilder builder) {

        super.addParameters(builder);
        builder.append("includeDFARepresentation:").append(includeDFARepresentation).append(",");
        builder.append("totalStates:").append(totalStates).append(", ");
        builder.append("alphabetLength:").append(alphabetLength);

    }

    public boolean isIncludeDFARepresentation() {
        return includeDFARepresentation;
    }

    public void setIncludeDFARepresentation(boolean includeDFARepresentation) {
        this.includeDFARepresentation = includeDFARepresentation;
    }

}
