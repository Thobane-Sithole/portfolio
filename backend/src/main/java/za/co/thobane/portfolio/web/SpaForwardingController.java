package za.co.thobane.portfolio.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Sends browser refreshes on front-end routes (no dot, not /api) back to index.html
 * so Angular can handle them.
 */
@Controller
public class SpaForwardingController {

    @GetMapping({"/{path:^(?!api|actuator)[^.]*}", "/{path:^(?!api|actuator)[^.]*}/**"})
    public String forward() {
        return "forward:/index.html";
    }
}
