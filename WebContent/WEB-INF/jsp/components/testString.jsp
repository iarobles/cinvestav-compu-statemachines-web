<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib uri="../../tlds/struts-tiles.tld" prefix="tiles"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@taglib uri="http://www.springframework.org/tags/form" prefix="form"%>


<script type="text/javascript">
	cinvestav.compu.constants.ALPHABET = [];

	<c:forEach var="symbol" items="${command.alphabet}" varStatus="alphabetStatus">
	cinvestav.compu.constants.ALPHABET[parseInt("${alphabetStatus.index}")] = '${symbol}';
	</c:forEach>
</script>

<script type="text/javascript">
	$(function() {

		cinvestav.compu.utils.multiselect(".string-test-input",
				cinvestav.compu.constants.ALPHABET);

		$(".string-test-input").focusout(
				function() {
					var multiSelectInput = $(this);

					var symbols = cinvestav.compu.utils.cleanTokens(
							multiSelectInput.val(),
							cinvestav.compu.constants.ALPHABET);

					multiSelectInput.val(symbols);
				});
	});
</script>


<div class="fieldset-box ui-widget-content background-erase">
	<div class="fieldset-title-box">
		<span class="fieldset-title">Probar Cadena</span><span
			class="fieldset-button"></span>
	</div>
	<div class="fieldset-content">
		<div class="form-row">

			<div class="form-col-left">
				<form:label path="stringToTest">Cadena a Probar:</form:label>
			</div>
			<div class="form-col-right">
				<form:input path="stringToTest" cssClass="string-test-input" />
			</div>
			<div class="clear"></div>
		</div>
		
		<c:if test="${empty isDFA}">
			<div class="form-row">
				<div class="form-col-left">Incluir DFA equivalente:</div>
				<div class="form-col-right">
					<form:checkbox path="includeDFARepresentation" />
				</div>
				<div class="clear"></div>
			</div>
		</c:if>

		<c:set var="stringToTestErrors">
			<form:errors path="stringToTest" />
		</c:set>
		<c:if test="${not empty stringToTestErrors}">
			<div class="ui-state-error ui-corner-all form-row text-center">
				<p>
					<strong>Error:</strong>
					<form:errors path="stringToTest" />
				</p>
			</div>
		</c:if>

		<div class="form-row">
			<c:choose>
				<c:when test="${isAcceptable !=null and isAcceptable==true}">

					<div class="ui-state-highlight ui-corner-all form-row text-center">
						<p>
							La cadena <strong>SI</strong> es aceptada por el automata
						</p>
					</div>


				</c:when>
				<c:when test="${isAcceptable !=null and isAcceptable==false}">
					<div class="ui-state-error ui-corner-all form-row text-center">
						<p>
							La cadena <strong>NO</strong> es aceptada por el automata
						</p>
					</div>
				</c:when>
			</c:choose>
		</div>


		<c:choose>
			<c:when test="${not empty isDFA}">
				<div class="form-row text-center">
					<input id="string_test_button" type="submit"
						value="Probar y generar código en C" class="text-center" />
				</div>
			</c:when>
			<c:otherwise>
				<div class="form-row text-center">
					<input id="string_test_button" type="submit" value="Probar cadena"
						class="text-center" />
				</div>
			</c:otherwise>
		</c:choose>

	</div>
</div>

<c:if test="${not empty codeInC and not empty isDFA}">
	<div class="fieldset-box ui-widget-content background-erase ">
		<div class="fieldset-title-box">
			<span class="fieldset-title">C&oacute;digo en C</span><span
				class="fieldset-button"></span>
		</div>
		<div class="fieldset-content code-box">
			<div class="form-row">
				<pre class="prettyprint">${codeInC}</pre>
			</div>
		</div>
	</div>

	<script type="text/javascript">
		$(function() {
			prettyPrint();
		});
	</script>
</c:if>