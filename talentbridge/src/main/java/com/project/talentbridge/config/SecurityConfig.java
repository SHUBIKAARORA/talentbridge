package com.project.talentbridge.config;

import com.project.talentbridge.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/recruiter/**").hasRole("recruiter")
                        .requestMatchers("/api/student/**").hasRole("student")
                        .requestMatchers("/api/alumni/experiences").hasAnyRole("alumni","student","admin")
                        .requestMatchers("/api/alumni/**").hasRole("alumni")
                        .requestMatchers("/api/tnp/jobs/student").hasRole("student")  // ADD THIS
                        .requestMatchers("/api/tnp/jobs").hasAnyRole("admin","student")
                        .requestMatchers("/api/tnp/**").hasRole("admin")
                        .anyRequest().permitAll()
                )
                .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
