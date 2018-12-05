<html>
<head>
<title>Hello World!</title>
</head>
<body>
	<h1>Hello World with tagged version 0.0.13!</h1>
	<p>
		It is now
		<%= new java.util.Date() %></p>
    <p>
        <b>Server Instance:</b>
        <%=request.getLocalAddr()%>
    </p>
</body>