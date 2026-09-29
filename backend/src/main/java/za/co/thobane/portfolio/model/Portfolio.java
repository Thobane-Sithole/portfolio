package za.co.thobane.portfolio.model;

import java.util.List;

/**
 * Everything the front-end needs to render the page. Loaded once from portfolio.json.
 */
public record Portfolio(
        Profile profile,
        List<Project> projects,
        List<Service> services,
        List<ProcessStep> process,
        List<StackGroup> stack,
        List<Testimonial> testimonials) {

    public record Profile(
            String name,
            String role,
            String headline,
            String location,
            String availability,
            List<String> about,
            String principle,
            String email,
            String github,
            String linkedin,
            String cvUrl) {
    }

    public record Project(
            String slug,
            String title,
            String summary,
            String problem,
            List<String> tech,
            String repoUrl,
            String liveUrl) {
    }

    public record Service(String title, String promise, String detail, List<String> tags) {
    }

    public record ProcessStep(String title, String promise, String detail) {
    }

    public record StackGroup(String label, List<String> items) {
    }

    public record Testimonial(String quote, String name, String role) {
    }
}
