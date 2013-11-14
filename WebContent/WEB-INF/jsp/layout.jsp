
<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib uri="../tlds/struts-tiles.tld" prefix="tiles"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@taglib uri="http://www.springframework.org/tags" prefix="spring"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>

<title>DFA Y FDA demos</title>
<meta name="description" content="Finite Deterministic Automata" />
<meta name="keywords"
	content="fda, deterministic, automata, finite, demo" />
<link href="${initParam.resourcesUrl}/img/logo.gif" rel="shortcut icon" />

<link rel="stylesheet" type="text/css"
	href="${initParam.resourcesUrl}/libs/jquery/css/start/jquery-ui-1.8.18.custom.css" />
<link rel="stylesheet" type="text/css"
	href="${initParam.resourcesUrl}/css/project.css" />
<link rel="stylesheet" type="text/css"
	href="${initParam.resourcesUrl}/libs/google_prettify/themes/sunburst-min.css" />

<script type="text/javascript"
	src="${initParam.resourcesUrl}/libs/jquery/js/jquery-1.7.1.min.js"></script>
<script type="text/javascript"
	src="${initParam.resourcesUrl}/libs/jquery/js/jquery-ui-1.8.18.custom.min.js"></script>
<script type="text/javascript"
	src="${initParam.resourcesUrl}/libs/jquery/widgets/combobox.js"></script>
<script type="text/javascript"
	src="${initParam.resourcesUrl}/js/initLayout.js"></script>

<script type="text/javascript"
	src="${initParam.resourcesUrl}/libs/jquery/widgets/multiselect.js"></script>

<script type="text/javascript"
	src="${initParam.resourcesUrl}/libs/google_prettify/prettify.js"></script>


<script type="text/javascript">
	cinvestav.compu.constants.FA_TYPE = "${faType}";
</script>

</head>
<body>
	<tiles:insert attribute="title" />
	<div id="main-box">
		<div id="main-content">
			<tiles:insert attribute="content" />
		</div>
		<div class="form-row text-center">* Los campos marcados con
			asterisco son obligatorios</div>
	</div>
</body>
</html>