package za.co.thobane.portfolio.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mail.javamail.JavaMailSender;
import za.co.thobane.portfolio.model.ContactMessage;
import za.co.thobane.portfolio.model.ContactRequest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;

class ContactServiceTest {

    private ContactService service;

    @BeforeEach
    void setUp() {
        service = new ContactService(new ContactProperties(2, "secret", "owner@example.com"), mock(JavaMailSender.class));
    }

    @Test
    void receiveTrimsInputAndStoresMessage() {
        ContactMessage saved = service.receive(new ContactRequest("  Lerato ", " lerato@example.com ", " Hello, let's talk. "));

        assertThat(saved.name()).isEqualTo("Lerato");
        assertThat(saved.email()).isEqualTo("lerato@example.com");
        assertThat(service.recentMessages()).containsExactly(saved);
    }

    @Test
    void keepsOnlyTheNewestMessagesUpToTheLimit() {
        service.receive(new ContactRequest("First", "a@example.com", "Message number one"));
        ContactMessage second = service.receive(new ContactRequest("Second", "b@example.com", "Message number two"));
        ContactMessage third = service.receive(new ContactRequest("Third", "c@example.com", "Message number three"));

        assertThat(service.recentMessages()).containsExactly(third, second);
    }

    @Test
    void adminCheckRequiresTheConfiguredToken() {
        assertThat(service.isAdmin("secret")).isTrue();
        assertThat(service.isAdmin("wrong")).isFalse();
        assertThat(service.isAdmin(null)).isFalse();
    }
}
