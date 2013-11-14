<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib uri="../../tlds/struts-tiles.tld" prefix="tiles"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@taglib uri="http://www.springframework.org/tags/form" prefix="form"%>

<div class="fieldset-box ui-widget-content background-erase">
	<div class="fieldset-title-box">
		<span class="fieldset-title">Estados Finales</span><span
			class="fieldset-button"></span>
	</div>
	<div class="fieldset-content">
		<div id="final_states_row" class="form-row">
			<div class="form-col-left">
				Estados<span class="field-required">*</span>:
			</div>
			<div class="form-col-right">
				<c:forEach items="${command.states}" varStatus="status" var="state">
					<c:choose>
						<c:when test="${finalStatesMap[status.index] != null}">
			${state}<input type="checkbox" name="finalStates"
								value="${status.index}" checked="checked" />
						</c:when>
						<c:otherwise>
			${state}<input type="checkbox" name="finalStates"
								value="${status.index}" />
						</c:otherwise>
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