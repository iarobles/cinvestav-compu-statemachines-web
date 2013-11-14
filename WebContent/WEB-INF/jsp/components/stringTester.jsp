<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib uri="../../tlds/struts-tiles.tld" prefix="tiles"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@taglib uri="http://www.springframework.org/tags/form" prefix="form"%>


<div class="form-row">
	<div class="form-col-left">Incluir DFA equivalente:</div>
	<div class="form-col-right">
		<form:checkbox path="includeDFARepresentation" value="true"/>	
	</div>
	<div class="clear"></div>
</div>