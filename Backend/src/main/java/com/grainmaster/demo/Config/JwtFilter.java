package com.grainmaster.demo.Config;


import jakarta.servlet.*;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.*;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
 
import java.io.IOException;
import java.util.List;
 
@Component
@RequiredArgsConstructor

//This is our custom JWT filter. It intercepts every incoming HTTP request and checks if it carries a valid JWT token 
// before the request reaches any controller.

//OncePerRequestFilter
//A Spring Security base class that guarantees this filter runs exactly once per request — not multiple times.
//  We extend it so we only need to override one method: doFilterInternal().
public class JwtFilter extends OncePerRequestFilter {
 
    //JwtUtil dependency
    //Our helper class that handles all JWT operations — generating tokens, extracting username, checking expiry.
    //  Injected by Spring.
    private final JwtUtil jwtUtil;
 
    @Override
    //HttpServletRequest
    //The incoming HTTP request object. We read the Authorization header from it to find the JWT token.

    //HttpServletResponse
    //The outgoing HTTP response object. We pass it along the filter chain after we're done.
    //The HTTP response object. If the token is invalid we can write a 401 error here, or just let it pass to the next 
    // filter which will return 403.

    //FilterChain
    //Spring Security's chain of filters. After our filter does its work, we MUST call filterChain.doFilter() to pass the request along. 
    // If we forget this, the request gets stuck and never reaches the controller.
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        //These are required by the method signature. ServletException handles servlet-level errors; 
        //IOException handles I/O failures when reading the request body.
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwtUtil.isValid(token)) {
                String email = jwtUtil.getEmail(token);
                String role  = jwtUtil.getRole(token);
                var auth = new UsernamePasswordAuthenticationToken(
                    email, null,
                    List.of(new SimpleGrantedAuthority("ROLE_" + role))
                );
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }
        chain.doFilter(request, response);
    }
}
 