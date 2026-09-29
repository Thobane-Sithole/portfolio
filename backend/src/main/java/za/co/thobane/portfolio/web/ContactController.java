package za.co.thobane.portfolio.web;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import za.co.thobane.portfolio.model.ContactMessage;
import za.co.thobane.portfolio.model.ContactRequest;
import za.co.thobane.portfolio.service.ContactService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> send(@Valid @RequestBody ContactRequest request) {
        ContactMessage saved = contactService.receive(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("id", saved.id().toString(), "status", "received"));
    }

    /** Read your messages: curl -H "X-Admin-Token: <token>" https://<your-app>.onrender.com/api/contact/messages */
    @GetMapping("/messages")
    public ResponseEntity<List<ContactMessage>> messages(
            @RequestHeader(value = "X-Admin-Token", required = false) String token) {
        if (!contactService.isAdmin(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(contactService.recentMessages());
    }
}
