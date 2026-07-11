package com.jobpilotai.backend.browserautomation.session;

import com.jobpilotai.backend.browserautomation.config.AutomationProperties;
import com.jobpilotai.backend.browserautomation.domain.AutomationExecution;
import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserContext;
import com.microsoft.playwright.BrowserType;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.Playwright;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Manages active Playwright browser sessions per automation execution.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BrowserSessionManager {

    private final AutomationProperties properties;

    private Playwright playwright;
    private Browser browser;

    private final Map<UUID, BrowserContext> contexts = new ConcurrentHashMap<>();
    private final Map<UUID, Page> activePages = new ConcurrentHashMap<>();

    @PostConstruct
    public void init() {
        log.info("Initializing Playwright Engine (Headless={})", properties.isHeadless());
        try {
            playwright = Playwright.create();
            browser = playwright.chromium().launch(new BrowserType.LaunchOptions()
                    .setHeadless(properties.isHeadless())
                    .setTimeout(properties.getTimeoutSeconds() * 1000));
            log.info("Playwright initialized successfully.");
        } catch (Exception e) {
            log.error("Failed to initialize Playwright. Automation will fail. Ensure 'npx playwright install' was run.", e);
        }
    }

    @PreDestroy
    public void destroy() {
        if (browser != null) {
            browser.close();
        }
        if (playwright != null) {
            playwright.close();
        }
    }

    public Page getOrCreatePage(AutomationExecution execution) {
        if (browser == null) {
            throw new IllegalStateException("Browser is not initialized");
        }

        UUID id = execution.getPublicId();
        
        if (activePages.containsKey(id)) {
            return activePages.get(id);
        }

        log.debug("Creating new browser context and page for execution: {}", id);
        
        // Create context
        BrowserContext context = browser.newContext(new Browser.NewContextOptions()
                .setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                .setViewportSize(1280, 800));
        
        // Ensure default timeout is set on context
        context.setDefaultTimeout(properties.getTimeoutSeconds() * 1000);
        
        contexts.put(id, context);
        
        Page page = context.newPage();
        activePages.put(id, page);
        
        return page;
    }

    public Page getPage(AutomationExecution execution) {
        Page page = activePages.get(execution.getPublicId());
        if (page == null) {
            throw new IllegalStateException("No active page for execution: " + execution.getPublicId());
        }
        return page;
    }

    public void cleanupSession(AutomationExecution execution) {
        UUID id = execution.getPublicId();
        log.debug("Cleaning up browser session for execution: {}", id);
        
        Page page = activePages.remove(id);
        if (page != null && !page.isClosed()) {
            try {
                page.close();
            } catch (Exception ignored) {}
        }
        
        BrowserContext context = contexts.remove(id);
        if (context != null) {
            try {
                context.close();
            } catch (Exception ignored) {}
        }
    }
}
