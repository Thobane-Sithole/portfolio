package za.co.thobane.portfolio.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Payload sent by the contact form.
 */
public record ContactRequest(
        @NotBlank(message = "Add your name so I know who to reply to.")
        @Size(max = 100, message = "Keep your name under 100 characters.")
        String name,

        @NotBlank(message = "Add an email address so I can reply.")
        @Email(message = "Check the email address; it looks incomplete.")
        @Size(max = 150, message = "Keep the email address under 150 characters.")
        String email,

        @NotBlank(message = "Write a short message about what you need.")
        @Size(min = 10, max = 2000, message = "Messages need between 10 and 2000 characters.")
        String message) {
}
