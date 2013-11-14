<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib uri="../../tlds/struts-tiles.tld" prefix="tiles"%>
<%@taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>


<form:form id="fa_form" action="${action}" method="post"
	command="command">

	<form:hidden path="alphabet" />
	<form:hidden path="states" />

	<div>
		<tiles:insert attribute="basicParams" />
		<tiles:insert attribute="matrix" />
		<tiles:insert attribute="finalStates" />
		<tiles:insert attribute="initialStates" />
		<tiles:insert attribute="testString" />
	</div>

</form:form>