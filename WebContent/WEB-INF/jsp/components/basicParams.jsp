<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib uri="../../tlds/struts-tiles.tld" prefix="tiles"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@taglib uri="http://www.springframework.org/tags/form" prefix="form"%>


<script type="text/javascript">
	$(function() {
		cinvestav.compu.initLayout();
	});
</script>

<div class="fieldset-box ui-widget-content background-erase">

	<div class="fieldset-title-box">
		<span class="fieldset-title">Parametros de entrada</span> <span
			id="params_title_button" class="fieldset-button"></span>
	</div>

	<div class="fieldset-content">

		<div class="form-row">
			<div class="form-col-left">
				<form:label path="alphabetLength">Longitud de Alfabeto<span
						class="field-required">*</span>:</form:label>
			</div>
			<div class="form-col-right">
				<form:input path="alphabetLength" id="alphabetLength" />
			</div>
			<div class="clear"></div>
		</div>

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
				<form:label path="alphabetAsString">Detallar alfabeto(separar con comas):</form:label>
			</div>
			<div class="form-col-right">
				<form:input path="alphabetAsString" id="alphabetAsString"></form:input>
			</div>
			<div class="clear"></div>
		</div>


		<div class="form-row">
			<div class="form-col-left">
				<form:label path="totalStates">Total de estados<span
						class="field-required">*</span>:</form:label>
			</div>
			<div class="form-col-right">
				<form:input path="totalStates" id="totalStates" />
			</div>
			<div class="clear"></div>
		</div>

		<c:set var="totalStatesErrors">
			<form:errors path="totalStates" />
		</c:set>
		<c:if test="${not empty totalStatesErrors}">
			<div class="ui-state-error ui-corner-all form-row text-center">
				<p>
					<strong>Error:</strong>
					<form:errors path="totalStates" />
				</p>
			</div>
		</c:if>

		<div class="form-row">
			<div class="form-col-left">
				<form:label path="statesAsString">Detallar estados(separar con comas)</form:label>
			</div>
			<div class="form-col-right">
				<form:input path="statesAsString" id="statesAsString" />
			</div>
			<div class="clear"></div>
		</div>


		<tiles:insert attribute="additionalParams" />


		<div id="" class="text-center">
			<input class="text-center" id="build_matrix_button" type="submit"
				value="Construir Matriz" />
		</div>
	</div>
</div>

