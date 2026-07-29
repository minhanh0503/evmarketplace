package com.evmarketplace.controller;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SPAController implements ErrorController {
    @RequestMapping("/error")
    public String handleError(HttpServletResponse response) {
        response.setStatus(HttpServletResponse.SC_OK);
        return "forward:/index.html";
    }
}