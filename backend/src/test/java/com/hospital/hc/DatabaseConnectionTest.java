package com.hospital.hc;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import org.junit.jupiter.api.Test;

public class DatabaseConnectionTest {

    @Test
    public void testConnection() {
        String url = System.getProperty("db.url");
        String user = System.getProperty("db.user");
        String pass = System.getProperty("db.pass");

        if (url == null || url.isEmpty()) {
            System.out.println("ERROR: db.url system property is not set! Use -Ddb.url=... to set it.");
            return;
        }

        System.out.println("==================================================");
        System.out.println("Testing connection to: " + url);
        System.out.println("Using user: " + user);
        System.out.println("==================================================");

        try (Connection conn = DriverManager.getConnection(url, user, pass);
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT 1")) {
            
            if (rs.next()) {
                System.out.println("\n>>> SUCCESS: Connection established and query 'SELECT 1' returned: " + rs.getInt(1) + " <<<\n");
            }
        } catch (Exception e) {
            System.out.println("\n>>> FAILURE: Could not establish connection to the database! <<<");
            System.out.println("Error details: " + e.getMessage());
            System.out.println("--------------------------------------------------");
            e.printStackTrace();
        }
    }
}
