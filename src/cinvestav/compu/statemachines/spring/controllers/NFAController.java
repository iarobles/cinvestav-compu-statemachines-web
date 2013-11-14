package cinvestav.compu.statemachines.spring.controllers;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

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
import cinvestav.compu.statemachine.NFAutomata;
import cinvestav.compu.statemachine.helpers.DFAHelper;
import cinvestav.compu.statemachine.helpers.NFAHelper;
import cinvestav.compu.statemachines.spring.forms.BasicDFAForm;
import cinvestav.compu.statemachines.spring.forms.CompleteDFAForm;

@Controller
@RequestMapping("/nfa")
public class NFAController {

    private static final Logger log = Logger.getLogger(NFAController.class);

    private static final String VIEW_INDEX = "nfa.layout";

    private static final String VIEW_INDEX_AJAX = "nfa.params";

    private static final String VIEW_PARAMSANDMATRIX = "nfa.paramsAndMatrix.layout";

    private static final String VIEW_PARAMSANDMATRIX_AJAX = "nfa.paramsAndMatrix";

    private static final String URL_INDEX = "index.do";

    private static final String VIEW_INCLUDE_DFA_AJAX = "nfa.include.dfa";

    private static final String VIEW_INCLUDE_DFA = "nfa.include.dfa.layout";

    @RequestMapping(value = "index", method = RequestMethod.GET)
    public String showIndex(final Model model) {
        BasicDFAForm dfaForm;

        dfaForm = new BasicDFAForm();

        if (log.isDebugEnabled()) log.debug("will show home for nfa");
        model.addAttribute("command", dfaForm);
        model.addAttribute("action", URL_INDEX);
        model.addAttribute("faType", "nfa");
        ;

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
            dfaForm.setStatesAsString(arrayToString(dfaForm.getStates()));
            dfaForm.setAlphabetAsString(arrayToString(dfaForm.getAlphabet()));

            //se vuelve a poner el total
            dfaForm.setAlphabetLength(dfaForm.getAlphabet().length);
            dfaForm.setTotalStates(dfaForm.getStates().length);

            if (log.isDebugEnabled()) log.debug("will show params and matrix, complete dfa form:" + dfaForm);
            model.addAttribute("command", dfaForm);
            model.addAttribute("transitionMatrix", getTransitionMatrixFromRequest(request, dfaForm.getStates().length, dfaForm.getAlphabet().length));
            model.addAttribute("finalStatesMap", buildFinalStatesMap(dfaForm.getFinalStates()));
            status.setComplete();
        } else {

            if (log.isDebugEnabled()) log.debug("there are some validation errors for:" + basicDFAForm);
            viewName = (basicDFAForm.getIsAjax()) ? VIEW_INDEX_AJAX : VIEW_INDEX;
            actionUrl = "matrix.do";
            model.addAttribute("dfa", basicDFAForm);
        }

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

    @RequestMapping(value = "buildFromDFA", method = RequestMethod.POST)
    public String buildFromDFA(HttpServletRequest request, final @ModelAttribute("command") @Valid CompleteDFAForm nfaForm, final BindingResult validationResult, SessionStatus status, Model model) {
        String viewName = "showAllErrors";

        if (!validationResult.hasErrors()) {
            showTestResult(request, nfaForm, validationResult, status, model);
            viewName = "showTransitionMatrixOnly";
        }

        if (log.isDebugEnabled()) log.debug(" nfa to dfa created :)");

        return viewName;
    }

    @RequestMapping(value = "test", method = RequestMethod.POST)
    public String showTestResult(HttpServletRequest request, final @ModelAttribute("command") @Valid CompleteDFAForm nfaForm, final BindingResult validationResult, SessionStatus status, Model model) {
        String viewName;
        NFAutomata nfa;
        String[][] transitionMatrix;

        viewName = (nfaForm.getIsAjax()) ? VIEW_PARAMSANDMATRIX_AJAX : VIEW_PARAMSANDMATRIX;
        transitionMatrix = getTransitionMatrixFromRequest(request, nfaForm.getStates().length, nfaForm.getAlphabet().length);
        log.debug("will test dfa, all parameters are:" + nfaForm + " transition matrix:" + transitionMatrix);

        model.addAttribute("finalStatesMap", buildFinalStatesMap(nfaForm.getFinalStates()));
        model.addAttribute("transitionMatrix", transitionMatrix);

        if (!validationResult.hasErrors()) {
            Boolean isAcceptable;
            List<List<Set<Integer>>> transitionMatrixFormatted;

            transitionMatrixFormatted = formatTransitionMatrix(transitionMatrix, nfaForm.getStates());

            nfa = new NFAutomata(Arrays.asList(nfaForm.getAlphabet()), Arrays.asList(nfaForm.getStates()), transitionMatrixFormatted, nfaForm.getInitialState(), new HashSet<Integer>(Arrays.asList(nfaForm.getFinalStates())));
            if (log.isDebugEnabled()) log.debug("nfa created:" + nfa);
            nfaForm.setStringToTest(nfaForm.getStringToTest().replace(" ", ""));
            isAcceptable = nfa.isAcceptable(nfaForm.getStringToTest(), ",");

            nfaForm.setIsAcceptable(isAcceptable);

            if (log.isDebugEnabled()) log.debug("nfa is aceptable:" + isAcceptable);
            model.addAttribute("isAcceptable", isAcceptable);

            if (nfaForm.getIncludeDFARepresentation()) {
                DFAutomata dfaAutomata;

                if (log.isDebugEnabled()) log.debug("will create dfa equivalent");
                dfaAutomata = NFAHelper.convertToDFA(nfa);
                CompleteDFAForm dfaForm = buildDFARepresentation(nfaForm, dfaAutomata);

                if (log.isDebugEnabled()) log.debug("dfaEq to send:" + dfaForm);
                model.addAttribute("dfaEq", dfaForm);
                model.addAttribute("dfaEqisAcceptable", dfaForm.getIsAcceptable());
                model.addAttribute("dfaEq.isAcceptable", dfaForm.getIsAcceptable());
                model.addAttribute("dfaEqTransitionMatrix", dfaAutomata.getTransitionMatrix());
                model.addAttribute("dfaEqFinalStatesMap", buildFinalStatesMap(dfaForm.getFinalStates()));

                try {
                    model.addAttribute("codeInC", DFAHelper.getEquivalentCodeInC(dfaAutomata, "&lt", "&gt"));
                } catch (Exception ex) {
                    model.addAttribute("codeInC", "error");
                }

                viewName = (nfaForm.getIsAjax()) ? VIEW_INCLUDE_DFA_AJAX : VIEW_INCLUDE_DFA;
            }
        } else {
            if (log.isDebugEnabled()) log.debug("there are some validation errors");
        }

        return viewName;
    }

    private CompleteDFAForm buildDFARepresentation(CompleteDFAForm nfaForm, DFAutomata dfaAutomata) {
        CompleteDFAForm dfaForm;

        dfaForm = new CompleteDFAForm();

        if (log.isDebugEnabled()) log.debug("dfa created from NFA:" + dfaAutomata);

        dfaForm.setAlphabet(dfaAutomata.getAlphabet().toArray(new String[dfaAutomata.getAlphabet().size()]));
        dfaForm.setAlphabetAsString(arrayToString(dfaForm.getAlphabet()));
        dfaForm.setAlphabetLength(dfaAutomata.getAlphabet().size());

        dfaForm.setFinalStates(dfaAutomata.getFinalStates().toArray(new Integer[dfaAutomata.getFinalStates().size()]));

        dfaForm.setInitialState(dfaAutomata.getInitialState());
        dfaForm.setStates(dfaAutomata.getStates().toArray(new String[dfaAutomata.getStates().size()]));
        dfaForm.setStatesAsString(arrayToString(dfaForm.getStates()));
        dfaForm.setTotalStates(dfaForm.getStates().length);

        //if (nfaForm.getStringToTest() != null && nfaForm.getStringToTest().length() > 0) {
        dfaForm.setIsAcceptable(dfaAutomata.isAcceptable(nfaForm.getStringToTest(), ","));
        //} else {
        //  dfaForm.setIsAcceptable(false);
        //}

        dfaForm.setIsAjax(nfaForm.getIsAjax());
        dfaForm.setStringToTest(nfaForm.getStringToTest());

        return dfaForm;
    }

    protected List<List<Set<Integer>>> formatTransitionMatrix(String[][] transitionMatrix, String[] statesArray) {
        List<List<Set<Integer>>> transitionMatrixFormatted;
        List<String> states = Arrays.asList(statesArray);

        transitionMatrixFormatted = new ArrayList<List<Set<Integer>>>();
        for (int row = 0; row < transitionMatrix.length; row++) {
            List<Set<Integer>> transitionMatrixRow = new ArrayList<Set<Integer>>();

            for (int column = 0; column < transitionMatrix[0].length; column++) {
                String setAsString = transitionMatrix[row][column];
                setAsString = setAsString.replace(" ", "");
                transitionMatrixRow.add(getIndexSetFromSymbols(setAsString.split(","), states));
            }
            transitionMatrixFormatted.add(transitionMatrixRow);
        }

        return transitionMatrixFormatted;
    }

    protected String[][] getTransitionMatrixFromRequest(HttpServletRequest request, Integer totalStates, Integer alphabetLength) {
        String[][] transitionMatrix;

        transitionMatrix = new String[totalStates][alphabetLength];
        for (int stateIndex = 0; stateIndex < totalStates; stateIndex++) {

            for (int symbolIndex = 0; symbolIndex < alphabetLength; symbolIndex++) {
                String setAsString = request.getParameter("transitionMatrix[" + stateIndex + "][" + symbolIndex + "]");
                setAsString = (setAsString != null) ? setAsString : "";

                transitionMatrix[stateIndex][symbolIndex] = setAsString;
            }
        }

        return transitionMatrix;
    }

    private Set<Integer> getIndexSetFromSymbols(String[] symbols, List<String> alphabet) {
        Set<Integer> symbolSet;

        symbolSet = new HashSet<Integer>();
        for (String symbol : symbols) {
            int symbolIndex = alphabet.indexOf(symbol);
            if (symbolIndex != -1) {
                symbolSet.add(symbolIndex);
            }
        }

        return symbolSet;
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

    protected String arrayToString(String theSet[]) {
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
}
