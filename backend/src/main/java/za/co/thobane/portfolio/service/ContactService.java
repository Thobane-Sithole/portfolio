package za.co.thobane.portfolio.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import za.co.thobane.portfolio.model.ContactMessage;
import za.co.thobane.portfolio.model.ContactRequest;

import java.util.ArrayList;
import java.util.Deque;
import java.util.List;
import java.util.concurrent.ConcurrentLinkedDeque;

@Service
public class ContactService {

    private static final Logger log = LoggerFactory.getLogger(ContactService.class);

    private final Deque<ContactMessage> messages = new ConcurrentLinkedDeque<>();
    private final ContactProperties properties;
    private final JavaMailSender mailSender;
    private final String mailUsername;

    public ContactService(ContactProperties properties,
                          JavaMailSender mailSender,
                          @Value("${spring.mail.username:}") String mailUsername) {
        this.properties = properties;
        this.mailSender = mailSender;
        this.mailUsername = mailUsername;
    }

    public ContactMessage receive(ContactRequest request) {
        ContactMessage message = ContactMessage.from(request);
        messages.addFirst(message);
        while (messages.size() > properties.maxStoredMessages()) {
            messages.pollLast();
        }
        log.info("New contact message {} from {} <{}>: {}",
                message.id(), message.name(), message.email(), message.message());
        sendNotification(message);
        return message;
    }

    public List<ContactMessage> recentMessages() {
        return new ArrayList<>(messages);
    }

    public boolean isAdmin(String token) {
        return token != null && token.equals(properties.adminToken());
    }

    private void sendNotification(ContactMessage message) {
        if (mailUsername.isBlank()) {
            log.debug("MAIL_USERNAME not set — skipping email notification");
            return;
        }

        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setFrom(mailUsername);
            mail.setTo(properties.ownerEmail());
            mail.setReplyTo(message.email());
            mail.setSubject("Portfolio contact from " + message.name());
            mail.setText("""
                    New message from your portfolio contact form.

                    Name:    %s
                    Email:   %s
                    Message: %s
                    """.formatted(message.name(), message.email(), message.message()));
            mailSender.send(mail);
            log.info("Notification email sent for message {}", message.id());
        } catch (MailException e) {
            log.error("Failed to send notification email for message {}", message.id(), e);
        }
    }
}
