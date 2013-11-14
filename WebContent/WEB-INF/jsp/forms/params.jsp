<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib uri="../../tlds/struts-tiles.tld" prefix="tiles"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@taglib uri="http://www.springframework.org/tags/form" prefix="form"%>

<form:form id="fa_form" action="${action}" method="post"
	commandName="command">
	<%-- only show basic params --%>
	<tiles:insert attribute="basicParams" />
</form:form>
