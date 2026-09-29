package za.co.thobane.portfolio.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import za.co.thobane.portfolio.model.Portfolio;

import static org.assertj.core.api.Assertions.assertThat;

class PortfolioServiceTest {

    @Test
    void loadsContentFromPortfolioJson() {
        Portfolio portfolio = new PortfolioService(new ObjectMapper()).getPortfolio();

        assertThat(portfolio.profile().name()).isEqualTo("Thobane Sithole");
        assertThat(portfolio.projects()).isNotEmpty();
        assertThat(portfolio.process()).isNotEmpty();
    }
}
