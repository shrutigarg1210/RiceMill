
// package com.grainmaster.demo.Config;

// import lombok.RequiredArgsConstructor;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.http.HttpMethod;
// import org.springframework.security.authentication.AuthenticationManager;
// import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// import org.springframework.security.config.http.SessionCreationPolicy;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.security.web.SecurityFilterChain;
// import static org.springframework.security.config.Customizer.withDefaults;
// import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


// @Configuration
// @EnableWebSecurity
// @RequiredArgsConstructor
// public class SecurityConfig {

//     private final JwtFilter jwtFilter;

//     @Bean
//     public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//         // Ensure Spring Security uses the MVC CORS configuration and allow preflight (OPTIONS)
//         http.cors(withDefaults());

//         http
//             .csrf(csrf -> csrf.disable())
//             .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//             .authorizeHttpRequests(auth -> auth
//                 // ── Fully public — no token needed ──────────────────
//                 .requestMatchers("/api/auth/**").permitAll()
//                 .requestMatchers("/api/products").permitAll()
//                 .requestMatchers("/api/products/available").permitAll()
//                 .requestMatchers("/api/products/{id}").permitAll()

//                 // ── Orders: POST (place) and track are public ────────
//                 // Logged-in users get their userId attached via JWT
//                 // Guests can still place orders and track
//                 .requestMatchers(HttpMethod.POST, "/api/orders").permitAll()
//                 // Allow preflight CORS checks for API endpoints
//                 .requestMatchers(HttpMethod.OPTIONS, "/api/**").permitAll()
//                 .requestMatchers(HttpMethod.GET,  "/api/orders/track/**").permitAll()
//                 .requestMatchers(HttpMethod.GET,  "/api/orders/customer").permitAll()

//                 // ── Enquiries: POST is public ────────────────────────
//                 .requestMatchers(HttpMethod.POST, "/api/enquiries").permitAll()

//                 // ── Contacts: POST is public ─────────────────────────
//                 .requestMatchers(HttpMethod.POST, "/api/contacts").permitAll()

//                 // ── Admin-only endpoints ─────────────────────────────
//                 .requestMatchers("/api/orders/all").hasRole("ADMIN")
//                 .requestMatchers("/api/enquiries/all").hasRole("ADMIN")
//                 .requestMatchers("/api/contacts/**").hasRole("ADMIN")
//                 .requestMatchers(HttpMethod.POST,   "/api/products").hasRole("ADMIN")
//                 .requestMatchers(HttpMethod.PUT,    "/api/products/**").hasRole("ADMIN")
//                 .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasRole("ADMIN")
//                 .requestMatchers(HttpMethod.PUT,    "/api/orders/**").hasRole("ADMIN")
//                 .requestMatchers(HttpMethod.PUT,    "/api/enquiries/**").hasRole("ADMIN")

//                 // ── Logged-in user endpoints ─────────────────────────
//                 .requestMatchers("/api/orders/my").authenticated()
//                 .requestMatchers("/api/enquiries/my").authenticated()
//                 .requestMatchers("/api/auth/profile").authenticated()

//                 // ── Everything else requires auth ────────────────────
//                 .anyRequest().authenticated()
//             )
//             .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

//         return http.build();
//     }

//     @Bean
//     public PasswordEncoder passwordEncoder() {
//         return new BCryptPasswordEncoder();
//     }

//     @Bean
//     public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
//         return config.getAuthenticationManager();
//     }
// }



package  com.mbrm.auth.security;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**").permitAll()
                .anyRequest().authenticated()
            );

        return http.build();
    }
}