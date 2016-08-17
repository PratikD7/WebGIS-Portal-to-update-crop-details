
<%@page import="sun.rmi.runtime.Log"%>
<%@page import="java.util.*"%>
<%@page import= "java.sql.*"%>

<%@page import= "java.sql.Connection"%>
<%@page import= "java.sql.DriverManager"%>
<%@page import= "java.sql.Statement"%>

<!DOCTYPE html>
<%!

%>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Invalid Username or Password</title>
    </head>
    <body>
        <h1>Invalid Username or Password</h1>

        <%
            String username = request.getParameter("username");
            String password = request.getParameter("password");
            //String new_value = request.getParameter("n_boroname");
            //String old_value = request.getParameter("c_boroname");
           /* String blk_id = request.getParameter("blk_id");
             String boroname = request.getParameter("boroname");
             Double population = Double.parseDouble(request.getParameter("population"));
             String c_name = request.getParameter("c_name");
             String c_present = request.getParameter("c_present");
             System.out.println("blk_id ="+blk_id+"boroname="+boroname+"population"+population);
             */
            //out.println("new val ="+new_value+"old_val="+old_value);
            System.out.println(username + ":" + password);
            //out.println(username + ":" + password);
            Connection c = null;
            Statement stmt = null;
            Boolean status = false;
            try {
                Class.forName("org.postgresql.Driver");
                c = DriverManager
                        .getConnection("jdbc:postgresql://localhost:5433/UserLogin",
                                "postgres", "nishant");
                if (c != null) {
                    out.println("Opened database successfully");
                } else {
                    for (int i = 0; i < 10; i++) {
                        out.println("");
                    }
                    out.println("Cannot open");
                }
                    //stmt = c.createStatement();
                //int uid;

                    //String query = "UPDATE nyc_census_blocks SET boroname = '"+new_value+"' WHERE boroname = '"+old_value+"';";
                //stmt.execute(query);
                //stmt.close();
                PreparedStatement state = c.prepareStatement("select * from logintable where username=? and password=?");
                state.setString(1, username);//1 specifies the first parameter in the query  
                state.setString(2, password);
                ResultSet rs = state.executeQuery();
                status = rs.next();

                if (status != false) {
                    response.sendRedirect("UpdateDetails.html");
                } else {

                    out.println("Invalid username & password please login again");
                    out.println(" <a href='index.html'> Login  </a>");
                }

                c.close();
            } catch (Exception e) {
                out.println("Exception");

                //System.exit(0);
            }
            //out.println("Table created successfully");


        %>


    </body>
</html>
