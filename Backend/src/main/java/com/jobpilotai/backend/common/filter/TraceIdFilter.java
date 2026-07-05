package com.jobpilotai.backend.common.filter;

import com.jobpilotai.backend.common.constants.SecurityConstants;
import com.jobpilotai.backend.common.util.StringUtils;
import com.jobpilotai.backend.common.util.TraceUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class TraceIdFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String traceId = request.getHeader(SecurityConstants.TRACE_ID_HEADER);
        if (!StringUtils.hasText(traceId)) {
            traceId = TraceUtils.createTraceId();
        }

        MDC.put(TraceUtils.TRACE_ID_KEY, traceId);
        response.setHeader(SecurityConstants.TRACE_ID_HEADER, traceId);
        try {
            filterChain.doFilter(request, response);
        } finally {
            MDC.remove(TraceUtils.TRACE_ID_KEY);
        }
    }
}
