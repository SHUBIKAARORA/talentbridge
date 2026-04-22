package com.project.talentbridge.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Autowired
    private JwtService jwtService;

    @Autowired
    private CustomUserDetailsService userDetailsService;


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // 1️⃣ Read Authorization header
        String authHeader = request.getHeader("Authorization");

        // 2️⃣ If no token, continue (important for login/register)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3️⃣ Extract token
        String token = authHeader.substring(7);

        // 4️⃣ Extract email from token
        String email = jwtService.extractEmail(token);

        // 5️⃣ Authenticate only if not already authenticated
        if (email != null ) {

            UserDetails userDetails =
                    userDetailsService.loadUserByUsername(email);

            // 6️⃣ Validate token
            if (jwtService.isTokenValid(token,userDetails)) {

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                // 7️⃣ Set authentication in context
                SecurityContextHolder.getContext().setAuthentication(authToken);
                System.out.println("JWT Filter executed");
                System.out.println("Email from token: " + email);

            }
        }

        // 8️⃣ Continue request
        filterChain.doFilter(request, response);
    }
}
