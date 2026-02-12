package com.rescue.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Tắt CSRF để có thể gọi API POST từ Swagger/Postman
                .csrf(csrf -> csrf.disable())

                // 2. Mở cửa cho Swagger và các API công khai
                .authorizeHttpRequests(auth -> auth
                        // Cho phép vào giao diện Swagger
                        .requestMatchers("/api/v1/swagger-ui/**", "/api/v1/v3/api-docs/**", "/api/v1/swagger-ui.html").permitAll()
                        // Cho phép gọi API gửi yêu cầu cứu hộ
                        .requestMatchers("/api/v1/citizen/**").permitAll()
                        // Các request khác tạm thời cho phép hết để bạn dễ test
                        .anyRequest().permitAll()
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("*")); // Cho phép mọi nguồn (hoặc http://localhost:8080)
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}