<%@ page import="java.io.*,java.util.*, javax.servlet.*,org.apache.log4j.Logger" %>
<!doctype html>
<html>
<body>
<h2>Hello World!</h2>
<%
  Logger logger = Logger.getLogger( "index.jsp" );
  logger.info("This is a test message");
%>
</body>
</html>
