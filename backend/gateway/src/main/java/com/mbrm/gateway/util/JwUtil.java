package com.mbrm.gateway.util;

import java.nio.charset.StandardCharsets;
import java.security.Key;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component

public class JwUtil {
    @Value("${jwt.secret}")

    private String secret;

    private Key getKey(){
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public Claims extractClaim(String token){
        return Jwts.parserBuilder()
        .setSigningKey(getKey())
        .build()
        .parseClaimsJws(token)
        .getBody();
    }

    public String extractRole(String token){
          System.out.println("===== JWT DEBUG =====");
         System.out.println("PATH = " + extractClaim(token).get("path", String.class)); 
         System.out.println("METHOD = " + extractClaim(token).get("method", String.class)); 
         System.out.println("ROLE = " + extractClaim(token).get("role", String.class)); 
         System.out.println("====================");
         
        return extractClaim(token).get("role",String.class);

      
    }

    public String extractEmail(String token){
        return extractClaim(token).getSubject();
    }

    public boolean validate(String token){
        try {
            extractClaim(token);
            return true;
        } catch (Exception e) {
            // TODO: handle exception
            return false;
        }
    }
}
