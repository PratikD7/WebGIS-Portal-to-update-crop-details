
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
        <title>JSP Page</title>
    </head>
    <body>
        <h1>Hello World!</h1>

        <%

            //String new_value = request.getParameter("n_boroname");
            //String old_value = request.getParameter("c_boroname");
            String blk_id = request.getParameter("blk_id");
            String boroname = request.getParameter("boroname");
            Double population = Double.parseDouble(request.getParameter("population"));
            String c_name = request.getParameter("c_name");
            String c_present = request.getParameter("c_present");
            System.out.println("blk_id ="+blk_id+"boroname="+boroname+"population"+population);
            //out.println("new val ="+new_value+"old_val="+old_value);
            Connection c = null;
            Statement stmt = null;
            try {
                Class.forName("org.postgresql.Driver");
                c = DriverManager
                        .getConnection("jdbc:postgresql://localhost:5432/nyc",
                                "postgres", "postgres");
                if (c != null) {
                    out.println("Opened database successfully");
                } else {
                    for(int i=0;i<10;i++){
                        out.println("");
                    }
                    out.println("Cannot open");
                }
                    //stmt = c.createStatement();
                //int uid;

                    //String query = "UPDATE nyc_census_blocks SET boroname = '"+new_value+"' WHERE boroname = '"+old_value+"';";
                //stmt.execute(query);
                    //stmt.close();
                PreparedStatement state = c.prepareStatement("update nyc_census_blocks set boroname = ? , popn_total = ?,crop_name =? ,crop_present =? where blkid = ?");
                state.setString(1,boroname);//1 specifies the first parameter in the query  
                state.setDouble(2,population);
                state.setString(3,c_name);
                state.setString(4,c_present);
                state.setString(5,blk_id);
                state.executeUpdate();

                c.close();
            } catch (Exception e) {
                out.println("Exception");
            }
            out.println("Table created successfully");
        %>


    </body>
</html>
