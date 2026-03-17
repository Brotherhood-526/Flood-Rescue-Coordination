package com.rescue.backend.controller.config;

import org.springframework.lang.NonNull;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.Collection;
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            public void addCorsMappings(@NonNull CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOriginPatterns(
                                "http://localhost:*",
                                "http://127.0.0.1:*",
                                "https://floodrescuecoordination-production.up.railway.app",
                                "https://be-floodrescuecoordination-production.up.railway.app",
                                "https://fe-floodrescuecoordination-production.up.railway.app",
                                "https://fe-flood-rescue-coordination-production.up.railway.app"

                        )
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
    @Bean
    public FilterRegistrationBean<OncePerRequestFilter> sameSiteCookieFilter() {
        FilterRegistrationBean<OncePerRequestFilter> filter = new FilterRegistrationBean<>();
        filter.setFilter(new OncePerRequestFilter() {
            @Override
            protected void doFilterInternal(HttpServletRequest request,
                                            HttpServletResponse response, FilterChain filterChain)
                    throws ServletException, IOException {
                filterChain.doFilter(request, response);
                Collection<String> headers = response.getHeaders(HttpHeaders.SET_COOKIE);
                boolean firstHeader = true;
                for (String header : headers) {
                    if (firstHeader) {
                        response.setHeader(HttpHeaders.SET_COOKIE, header + "; SameSite=None; Secure");
                        firstHeader = false;
                    } else {
                        response.addHeader(HttpHeaders.SET_COOKIE, header + "; SameSite=None; Secure");
                    }
                }
            }
        });
        filter.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return filter;
    }
}