package za.co.thobane.portfolio.service;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "portfolio.contact")
public record ContactProperties(int maxStoredMessages, String adminToken, String ownerEmail) {
}
