package za.co.thobane.portfolio.web;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import za.co.thobane.portfolio.model.ContactMessage;
import za.co.thobane.portfolio.model.ContactRequest;
import za.co.thobane.portfolio.service.ContactService;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ContactController.class)
class ContactControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ContactService contactService;

    @Test
    void validMessageReturns201() throws Exception {
        UUID id = UUID.randomUUID();
        when(contactService.receive(any(ContactRequest.class)))
                .thenReturn(new ContactMessage(id, "Lerato", "lerato@example.com", "Hello there, Thobane", Instant.now()));

        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"Lerato","email":"lerato@example.com","message":"Hello there, Thobane"}
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(id.toString()));
    }

    @Test
    void invalidMessageReturnsFieldErrors() throws Exception {
        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"","email":"not-an-email","message":"short"}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.name").exists())
                .andExpect(jsonPath("$.errors.email").exists())
                .andExpect(jsonPath("$.errors.message").exists());

        verify(contactService, never()).receive(any());
    }

    @Test
    void messagesNeedTheAdminToken() throws Exception {
        when(contactService.isAdmin("secret")).thenReturn(true);
        when(contactService.recentMessages()).thenReturn(List.of());

        mockMvc.perform(get("/api/contact/messages")).andExpect(status().isUnauthorized());
        mockMvc.perform(get("/api/contact/messages").header("X-Admin-Token", "secret")).andExpect(status().isOk());
    }
}
