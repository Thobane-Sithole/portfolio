package za.co.thobane.portfolio.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import za.co.thobane.portfolio.model.Portfolio;

import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;

/**
 * Reads portfolio.json once at startup. Edit that file to change the site's content.
 */
@Service
public class PortfolioService {

    static final String CONTENT_FILE = "portfolio.json";

    private final Portfolio portfolio;

    public PortfolioService(ObjectMapper objectMapper) {
        this.portfolio = load(objectMapper);
    }

    public Portfolio getPortfolio() {
        return portfolio;
    }

    private static Portfolio load(ObjectMapper objectMapper) {
        try (InputStream in = new ClassPathResource(CONTENT_FILE).getInputStream()) {
            return objectMapper.readValue(in, Portfolio.class);
        } catch (IOException e) {
            throw new UncheckedIOException("Could not read " + CONTENT_FILE + " from the classpath", e);
        }
    }
}
