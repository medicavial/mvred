<!DOCTYPE html>
<html lang="es-MX" ng-app="app">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
	<title>SACE MV 1.0</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
	<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=RobotoDraft:300,400,500,700,400italic"/>
	<link rel="icon" type="image/png" href="img/favicon.png" />

	<link rel="stylesheet" href="css/style.min.css">
	<base href="/">
</head>
<body>

	<ui-view class="base central" layout="column" md-theme="{{ tema }}" md-theme-watch></ui-view>
	
	<script src="js/vendor.min.js"></script>
	
	<script src="js/app.min.js"></script>
</body>
</html>
</html>