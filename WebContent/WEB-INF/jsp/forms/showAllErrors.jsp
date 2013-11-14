<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib uri="../../tlds/struts-tiles.tld" prefix="tiles"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@taglib uri="http://www.springframework.org/tags/form" prefix="form"%>

<form:errors />

<c:set var="allErrors">
	<form:errors />
</c:set>
<h3>There are some errors.</h3>
<c:if test="${not empty allErrors}">
	<div class="ui-state-error ui-corner-all form-row text-center">
		<p>
			<strong>Error:</strong>
			<form:errors />
		</p>
	</div>
</c:if>