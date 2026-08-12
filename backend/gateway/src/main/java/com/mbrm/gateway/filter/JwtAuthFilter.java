package com.mbrm.gateway.filter;

import java.io.IOException;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.mbrm.gateway.util.JwUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletRequestWrapper;


import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor

public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwUtil jwUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

                String path = request.getRequestURI();
                String method = request.getMethod();

               if (path.equals("/auth/login") || path.equals("/auth/register") || 
               (path.startsWith("/products") && method.equals("GET"))) 
               { 
                System.out.println("Path: " + path + " Method: " + method);
                filterChain.doFilter(request, response); 
                return; }
                
                String authHeader = request.getHeader("Authorization");

                if(authHeader == null || !authHeader.startsWith("Bearer ")){
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("Missing Token");
                    return;
                }

        String token = authHeader.substring(7);
         if (!jwUtil.validate(token)) 
            { response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); 
                response.getWriter().write("Invalid token"); 
                return; 
            } 

            String email = jwUtil.extractEmail(token);
            String role = jwUtil.extractRole(token); 
            System.out.println("===== JWT DEBUG ====="); 
            System.out.println("PATH = " + path); 
            System.out.println("METHOD = " + method); 
            System.out.println("ROLE = " + role); 
            System.out.println("====================");
        
         // Admin-only product modifications // Product admin protection
        if (path.startsWith("/products") &&
                !method.equals("GET") &&
                !"ADMIN".equals(role)) {

            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().write("Admin access required");
            return;
        }

        // Auth admin APIs 
        if (path.startsWith("/auth/users/") && method.equals("PATCH")) 
            { 
                if (!"ADMIN".equals(role)) { 
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN); 
                    response.getWriter().write("Admin access required"); 
                    return; 
                } 
            }
        // Admin can see all orders 
        if (path.equals("/orders") && method.equals("GET") && !"ADMIN".equals(role)) { 
            response.setStatus(HttpServletResponse.SC_FORBIDDEN); 
            response.getWriter().write("Admin access required"); 
        return; 
       }

       

        filterChain.doFilter(request, response);
    }
}
