package cinvestav.compu.statemachines.spring.controllers;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.support.SessionStatus;

import cinvestav.compu.statemachine.DFAutomata;
import cinvestav.compu.statemachine.helpers.DFAHelper;
import cinvestav.compu.statemachines.spring.forms.BasicDFAForm;
import cinvestav.compu.statemachines.spring.forms.CompleteDFAForm;

@Controller
@RequestMapping("/dfa")
public class DFAController {

    private static final Logger log = Logger.getLogger(DFAController.class);

    private static final String VIEW_INDEX = "dfa.layout";

    private static final String VIEW_INDEX_AJAX = "dfa.params";

    private static final String VIEW_PARAMSANDMATRIX = "dfa.paramsAndMatrix.layout";

    private static final String VIEW_PARAMSANDMATRIX_AJAX = "dfa.paramsAndMatrix";

    private static final String URL_INDEX = "index.do";

    @RequestMapping(value = "index", method = RequestMethod.GET)
    public String showIndex(final Model model) {
        BasicDFAForm dfaForm;

        dfaForm = new BasicDFAForm();

        if (log.isDebugEnabled()) log.debug("will show home for dfa");
        model.addAttribute("command", dfaForm);
        model.addAttribute("action", URL_INDEX);
        model.addAttribute("faType", "dfa");

        return VIEW_INDEX;
    }

    /**
     * Metod a utilizar si se especifican los estados o el alfabeto
     * @param dfaForm
     * @param validationResult
     * @return
     */
    @RequestMapping("detailed-matrix")
    public String showParamsAndMatrixDetailed(HttpServletRequest request, final @ModelAttribute("command") @Valid BasicDFAForm basicDFAForm, final BindingResult validationResult, SessionStatus status, Model model) {
        String viewName, actionUrl;

        if (!validationResult.hasErrors()) {

            actionUrl = "test.do";
            if (log.isDebugEnabled()) log.debug("will show params and matrix, input:" + basicDFAForm);
            CompleteDFAForm dfaForm = new CompleteDFAForm(basicDFAForm);
            viewName = (dfaForm.getIsAjax()) ? VIEW_PARAMSANDMATRIX_AJAX : VIEW_PARAMSANDMATRIX;

            if (dfaForm.getAlphabetAsString() != null && dfaForm.getAlphabetAsString().replace(" ", "").length() > 0) {

                dfaForm.setAlphabet(stringToArray(dfaForm.getAlphabetAsString(), ","));
            } else {

                dfaForm.setAlphabet(buildStringArray(dfaForm.getAlphabetLength(), "s"));
            }

            if (dfaForm.getStatesAsString() != null && dfaForm.getStatesAsString().replace(" ", "").length() > 0) {

                dfaForm.setStates(stringToArray(dfaForm.getStatesAsString(), ","));
            } else {

                dfaForm.setStates(buildStringArray(dfaForm.getTotalStates(), "q"));
            }

            //se vuelven a poner las cadenas
            dfaForm.setStatesAsString(setToString(dfaForm.getStates()));
            dfaForm.setAlphabetAsString(setToString(dfaForm.getAlphabet()));
            dfaForm.setAlphabetLength(dfaForm.getAlphabet().length);
            dfaForm.setTotalStates(dfaForm.getStates().length);

            model.addAttribute("command", dfaForm);            
            model.addAttribute("transitionMatrix", getTransitionMatrixFromRequest(request,dfaForm.getStates().length , dfaForm.getAlphabet().length));
            model.addAttribute("finalStatesMap", buildFinalStatesMap(dfaForm.getFinalStates()));
            status.setComplete();
        } else {

            if (log.isDebugEnabled()) log.debug("there are some validation errors for:" + basicDFAForm);
            viewName = (basicDFAForm.getIsAjax()) ? VIEW_INDEX_AJAX : VIEW_INDEX;
            actionUrl = "matrix.do";
            model.addAttribute("dfa", basicDFAForm);
        }

        model.addAttribute("isDFA", true);
        model.addAttribute("action", actionUrl);

        return viewName;
    }

    /**
     * Metodo a utilizar si no se especifica el alfabeto o los estados
     * @param basicDFAForm
     * @param validationResult
     * @return
     */
    @RequestMapping(value = "index", method = RequestMethod.POST)
    public String showParamsAndMatrix(HttpServletRequest request, final @ModelAttribute("command") @Valid BasicDFAForm basicDFAForm, final BindingResult validationResult, SessionStatus status, Model model) {
        String viewName;

        if (log.isDebugEnabled()) log.debug("will show params and matrix, input:" + basicDFAForm);
        if (validationResult.hasErrors()) {
            viewName = (basicDFAForm.getIsAjax()) ? VIEW_INDEX_AJAX : VIEW_INDEX;
            model.addAttribute("action", URL_INDEX);
        } else {
            viewName = showParamsAndMatrixDetailed(request, basicDFAForm, validationResult, status, model);
        }

        return viewName;
    }        

    @RequestMapping(value = "test", method = RequestMethod.POST)
    public String showTestResult(HttpServletRequest request, final @ModelAttribute("command") @Valid CompleteDFAForm dfaForm, final BindingResult validationResult, SessionStatus status, Model model) {
        String viewName;
        DFAutomata dfa;
        int[][] transitionMatrix;

        viewName = (dfaForm.getIsAjax()) ? VIEW_PARAMSANDMATRIX_AJAX : VIEW_PARAMSANDMATRIX;
        transitionMatrix = getTransitionMatrixFromRequest(request, dfaForm.getStates().length, dfaForm.getAlphabet().length);
        if(log.isDebugEnabled())log.debug("will test dfa, all parameters are:" + dfaForm + " transition matrix:" + arrayToString(transitionMatrix));

        model.addAttribute("finalStatesMap", buildFinalStatesMap(dfaForm.getFinalStates()));
        model.addAttribute("transitionMatrix", transitionMatrix);

        if (!validationResult.hasErrors()) {
            Boolean isAcceptable;

            dfa = new DFAutomata(dfaForm.getAlphabet(), transitionMatrix, dfaForm.getInitialState(), dfaForm.getFinalStates());
            log.debug("dfa created:" + dfa);
            isAcceptable = dfa.isAcceptable(dfaForm.getStringToTest().replace(" ", ""), ",");
            dfaForm.setIsAcceptable(isAcceptable);
            model.addAttribute("isAcceptable", isAcceptable);

            try {
                model.addAttribute("codeInC", DFAHelper.getEquivalentCodeInC(dfa,"&lt","&gt"));
            } catch (Exception ex) {
                model.addAttribute("codeInC", "error");
            }
            
            model.addAttribute("isDFA",true);

            log.debug("dfa is aceptable:" + isAcceptable);
        } else {
            log.debug("there are some validation errors");
        }

        return viewName;
    }

    protected int[][] getTransitionMatrixFromRequest(HttpServletRequest request, Integer totalStates, Integer alphabetLength) {
        int[][] transitionMatrix = new int[totalStates][alphabetLength];
        for (int i = 0; i < totalStates; i++) {
            for (int j = 0; j < alphabetLength; j++) {
                String numberAsString = request.getParameter("transitionMatrix[" + i + "][" + j + "]");
                numberAsString = (numberAsString != null) ? numberAsString : "-1";

                transitionMatrix[i][j] = Integer.parseInt(numberAsString);
            }
        }

        return transitionMatrix;
    }

    protected Map<Integer, Boolean> buildFinalStatesMap(Integer[] finalStates) {
        Map<Integer, Boolean> finalStatesMap = new HashMap<Integer, Boolean>();

        if (finalStates != null) {

            for (Integer stateIndex : finalStates) {
                finalStatesMap.put(stateIndex, true);
            }
        }

        return finalStatesMap;
    }
    
    protected String arrayToString(int[][] theArray){
        StringBuilder builder;
        
        builder = new StringBuilder();
        for(int row=0; row< theArray.length; row++){
            builder.append("{");
            for(int column = 0; column< theArray[0].length; column++){
                builder.append("\'").append(theArray[row][column]).append("\'");
            }
            builder.append("},");
        }
        
        return builder.toString();
    }
    
    protected String[] stringToArray(String theString, String delimiter) {
        return theString.replace(" ", "").split(delimiter);
    }

    protected String[] buildStringArray(Integer defaultTotal, String defaultPrefix) {
        String[] values;

        values = new String[defaultTotal];

        for (int index = 0; index < defaultTotal; index++) {
            values[index] = defaultPrefix + index;
        }

        return values;
    }

    protected String setToString(String theSet[]) {
        StringBuilder builder;
        boolean isFirst = true;

        builder = new StringBuilder();
        for (String element : theSet) {

            if (!isFirst) {
                builder.append(",");
            } else {
                isFirst = false;
            }

            builder.append(element);
        }

        return builder.toString();
    }
}
