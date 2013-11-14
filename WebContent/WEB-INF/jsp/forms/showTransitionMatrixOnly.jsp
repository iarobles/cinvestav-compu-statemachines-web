<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib uri="../../tlds/struts-tiles.tld" prefix="tiles"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@taglib uri="http://www.springframework.org/tags/form" prefix="form"%>

<h1 class="text-center index-title">DFA Equivalente</h1>

<form:form action="#" method="post" commandName="dfaEq">

	<c:if test="${dfaEq.isAcceptable !=null}">
		<div class="fieldset-box ui-widget-content background-erase">

			<div class="fieldset-title-box">
				<span class="fieldset-title">Resultado cadena a probar</span> <span
					id="params_title_button" class="fieldset-button-dfa"></span>
			</div>

			<div class="fieldset-content">

				<div class="form-row">
					<c:choose>
						<c:when
							test="${dfaEq.isAcceptable !=null and dfaEq.isAcceptable==true}">

							<div
								class="ui-state-highlight ui-corner-all form-row text-center">
								<p>
									La cadena <strong>SI</strong> es aceptada por el automata
								</p>
							</div>


						</c:when>
						<c:when
							test="${dfaEq.isAcceptable !=null and dfaEq.isAcceptable==false}">
							<div class="ui-state-error ui-corner-all form-row text-center">
								<p>
									La cadena <strong>NO</strong> es aceptada por el automata
								</p>
							</div>
						</c:when>
					</c:choose>
				</div>

			</div>
		</div>
	</c:if>

	<div class="fieldset-box ui-widget-content background-erase">

		<div class="fieldset-title-box">
			<span class="fieldset-title">Parametros de entrada</span> <span
				id="params_title_button" class="fieldset-button-dfa"></span>
		</div>

		<div class="fieldset-content">

			<c:set var="alphabetErrors">
				<form:errors path="alphabetLength" />
			</c:set>
			<c:if test="${not empty alphabetErrors}">
				<div class="ui-state-error ui-corner-all form-row text-center">
					<p>
						<strong>Error:</strong>
						<form:errors path="alphabetLength" />
					</p>
				</div>
			</c:if>

			<div class="form-row">
				<div class="form-col-left">
					<form:label path="alphabetAsString">Alfabeto(separado por comas):</form:label>
				</div>
				<div class="form-col-right">
					<form:input path="alphabetAsString" disabled="true"
						id="alphabetAsString"></form:input>
				</div>
				<div class="clear"></div>
			</div>


			<div class="form-row">
				<div class="form-col-left">
					<form:label path="statesAsString">Estados(separados por comas)</form:label>
				</div>
				<div class="form-col-right">
					<form:textarea disabled="true" path="statesAsString"
						id="statesAsString" cssClass="textarea-states" />
				</div>
				<div class="clear"></div>
			</div>

		</div>
	</div>


	<div class="fieldset-box ui-widget-content background-erase">

		<div class="fieldset-title-box">
			<span class="fieldset-title">Matriz de transici&oacute;n(DFA)</span>
			<span id="params_title_button" class="fieldset-button-dfa"></span>
		</div>

		<div class="fieldset-content">

			<table class="transition-matrix-dfa">
				<caption></caption>
				<thead>
					<tr>
						<th>\</th>
						<c:forEach var="symbol" items="${dfaEq.alphabet}">
							<th><c:out value="${symbol}" /></th>
						</c:forEach>
					</tr>
				</thead>
				<tbody>
					<c:forEach var="state" items="${dfaEq.states}"
						varStatus="stateStatus">
						<tr>
							<td><strong><c:out value="${state}" /></strong></td>
							<c:forEach var="symbol" items="${dfaEq.alphabet}"
								varStatus="symbolStatus">

								<c:set var="stateIndex"
									value="${dfaEqTransitionMatrix[stateStatus.index][symbolStatus.index]}" />
								<td><strong>${dfaEq.states[stateIndex]}</strong></td>
							</c:forEach>
						</tr>
					</c:forEach>
				</tbody>
			</table>
		</div>
	</div>


	<div class="fieldset-box ui-widget-content background-erase">
		<div class="fieldset-title-box">
			<span class="fieldset-title">Estados Finales</span><span
				class="fieldset-button-dfa"></span>
		</div>
		<div class="fieldset-content">
			<div id="final_states_row" class="form-row">
				<div class="form-col-left">
					Estados<span class="field-required">*</span>:
				</div>
				<div class="form-col-right">
					<c:forEach items="${dfaEq.states}" varStatus="status" var="state">
						<c:choose>
							<c:when test="${dfaEqFinalStatesMap[status.index] != null}">
			${state}<input type="checkbox" name="finalStates"
									value="${status.index}" name="${state}" checked="checked" />
							</c:when>
						</c:choose>

					</c:forEach>
				</div>
				<div class="clear"></div>
			</div>


			<c:set var="finalStatesErrors">
				<form:errors path="finalStates" />
			</c:set>
			<c:if test="${not empty finalStatesErrors}">
				<div class="ui-state-error ui-corner-all form-row text-center">
					<p>
						<strong>Error:</strong>
						<form:errors path="finalStates" />
					</p>
				</div>
			</c:if>

		</div>
	</div>

	<c:if test="${not empty codeInC}">
		<div class="fieldset-box ui-widget-content background-erase">
			<div class="fieldset-title-box">
				<span class="fieldset-title">C&oacute;digo en C</span><span
					class="fieldset-button-dfa"></span>
			</div>
			<div class="fieldset-content code-box">
				<div class="form-row">
					<pre class="prettyprint">${codeInC}</pre>
				</div>
			</div>
		</div>
	</c:if>

	<script type="text/javascript">
		$(function() {
			cinvestav.compu.drawFieldSetButtons(".fieldset-button-dfa");
			prettyPrint();
		});
	</script>

</form:form>