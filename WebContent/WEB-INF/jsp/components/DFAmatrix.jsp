<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib uri="../../tlds/struts-tiles.tld" prefix="tiles"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@taglib uri="http://www.springframework.org/tags/form" prefix="form"%>

<script type="text/javascript">
	$(".transition-matrix-combobox").combobox({inputCss:'transition-matrix-combobox'});
	
</script>

<div class="fieldset-box ui-widget-content background-erase">

	<div class="fieldset-title-box">
		<span class="fieldset-title">Matriz de transici&oacute;n(DFA)</span> <span
			id="params_title_button" class="fieldset-button"></span>
	</div>
	
	<div class="fieldset-content">
		<p>Conjunto Vacio = Dejar en blanco</p>
		<table class="transition-matrix-dfa">
			<caption></caption>
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
							<td><select
								name="transitionMatrix[${stateStatus.index}][${symbolStatus.index}]" class="transition-matrix-combobox">
									<c:forEach var="state" items="${command.states}"
										varStatus="innerStateStatus">
										<c:choose>
											<c:when
												test="${transitionMatrix[stateStatus.index][symbolStatus.index] == innerStateStatus.index}">
												<option value="${innerStateStatus.index}" selected="selected">${state}</option>
											</c:when>
											<c:otherwise>
												<option value="${innerStateStatus.index}">${state}</option>
											</c:otherwise>
										</c:choose>
									</c:forEach>
							</select></td>
						</c:forEach>
					</tr>
				</c:forEach>
			</tbody>
		</table>
	</div>
</div>