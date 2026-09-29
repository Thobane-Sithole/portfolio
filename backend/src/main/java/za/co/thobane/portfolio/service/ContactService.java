package za.co.thobane.portfolio.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import za.co.thobane.portfolio.model.ContactMessage;
import za.co.thobane.portfolio.model.ContactRequest;

import java.util.ArrayList;
import java.util.Deque;
import java.util.List;
import java.util.concurrent.ConcurrentLinkedDeque;

/**
 * Keeps the most recent contact messages in memory and logs each one,
 * so they also show up in Render's log stream.
 */
@Service
public class ContactService {

    private static final Logger log = LoggerFactory.getLogger(ContactService.class);

    private final Deque<ContactMessage> messages = new ConcurrentLinkedDeque<>();
    private final ContactProperties properties;

    public ContactService(ContactProperties properties) {
        this.properties = properties;
    }

    public ContactMessage receive(ContactRequest request) {
        ContactMessage message = ContactMessage.from(request);
        messages.addFirst(message);
        while (messages.size() > properties.maxStoredMessages()) {
            messages.pollLast();
        }
        log.info("New contact message {} from {} <{}>: {}",
                message.id(), message.name(), message.email(), message.message());
        return message;
    }

    public List<ContactMessage> recentMessages() {
        return new ArrayList<>(messages);
    }

    public boolean isAdmin(String token) {
        return token != null && token.equals(properties.adminToken());
    }
}
