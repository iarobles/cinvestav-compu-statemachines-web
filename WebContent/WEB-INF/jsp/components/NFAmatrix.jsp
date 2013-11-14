<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib uri="../../tlds/struts-tiles.tld" prefix="tiles"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@taglib uri="http://www.springframework.org/tags/form" prefix="form"%>


<script type="text/javascript">
	cinvestav.compu.constants.STATES = [];

	<c:forEach var="state" items="${command.states}" varStatus="stateStatus">
	cinvestav.compu.constants.STATES[parseInt("${stateStatus.index}")] = '${state}';
	</c:forEach>
</script>

<script type="text/javascript">
	$(function() {
		cinvestav.compu.utils.multiselect(".nfa-state-input",
				cinvestav.compu.constants.STATES);
		
		$(".nfa-state-input").focusout(function(){
			var multiSelectInput = $(this);
			
			var states = cinvestav.compu.utils.cleanTokens(multiSelectInput.val(), cinvestav.compu.constants.STATES);
			
			multiSelectInput.val(states);
		});
	});
</script>

<div class="fieldset-box ui-widget-content background-erase">

	<div class="fieldset-title-box">
		<span class="fieldset-title">Matriz de transici&oacute;n(NFA)</span> <span
			id="params_title_button" class="fieldset-button"></span>
	</div>		

	<div class="fieldset-content">
		<p>Conjunto Vacio = Dejar en blanco</p>
		<table class="transition-matrix-nfa">
			<thead>
				<tr>
					<th>\</th>
					<c:forEach var="symbol" items="${command.alphabet}">
						<th><c:out value="${symbol}" /></th>
					</c:forEach>
				</tr>
			</thead>
			<tbody>
				<c:forEach var="state" items="${command.states}"
					varStatus="stateStatus">
					<tr>
						<td><strong><c:out value="${state}" /></strong></td>
						<c:forEach var="symbol" items="${command.alphabet}"
							varStatus="symbolStatus">
							<td>{<input statename="${state}" symbolname="${symbol}"
								type="text" class="nfa-state-input"
								name="transitionMatrix[${stateStatus.index}][${symbolStatus.index}]"
								value="${transitionMatrix[stateStatus.index][symbolStatus.index]}" />}
							</td>
						</c:forEach>
					</tr>
				</c:forEach>
			</tbody>
		</table>
	</div>

	<div id="notvalid_nfa" class="form-row invisible">
		<div class="ui-state-error ui-corner-all form-row text-center">
			<p>
				<strong>Error:&nbsp;</strong><strong id="notvalid_nfa_errormessage"></strong>
			</p>
		</div>
	</div>
</div>