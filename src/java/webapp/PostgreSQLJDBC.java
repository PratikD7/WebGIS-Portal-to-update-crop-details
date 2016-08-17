package webapp;
import java.sql.*;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;


public class PostgreSQLJDBC {
   public static void main( String args[] )
     {
       Connection c = null;
       Statement stmt = null;
       try {
         Class.forName("org.postgresql.Driver");
         c = DriverManager
            .getConnection("jdbc:postgresql://localhost:5432/nyc",
            "postgres", "postgres");
         if(c!=null)
            System.out.println("Opened database successfully");
         else 
            System.out.println("Nai hua re");
         stmt = c.createStatement();
         int uid;
         String query = "SELECT gid FROM NYC_CENSUS_BLOCKS WHERE BORONAME = 'Nagpur';";
         ResultSet rset = stmt.executeQuery(query);
         while(rset.next()){
             uid= rset.getInt("gid");
             System.out.println(uid);
         }
         stmt.close();
         c.close();
       } catch ( Exception e ) {
         System.err.println( e.getClass().getName()+": "+ e.getMessage() );
         System.exit(0);
       }
       System.out.println("Table created successfully");
                 
     }
}