package za.co.thobane.portfolio.model;

import java.time.Instant;
import java.util.UUID;

/**
 * A stored contact form submission.
 */
public record ContactMessage(UUID id, String name, String email, String message, Instant receivedAt) {

    public static ContactMessage from(ContactRequest request) {
        return new ContactMessage(
                UUID.randomUUID(),
                request.name().strip(),
                request.email().strip(),
                request.message().strip(),
                Instant.now());
    }
}
