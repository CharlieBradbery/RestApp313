package web.restapp.restapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import web.restapp.restapp.model.User;
import web.restapp.restapp.service.UserService;

@Controller
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/last_user")
    public String Userdata(Authentication authentication, Model model){
        User user = (User) authentication.getPrincipal();
        model.addAttribute("user", user);
        return "userdata";
    }

    @GetMapping("/admin")
    public String getRest(){
        return "rest1";
    }
    @GetMapping("/user")
    public String getCurrentUser(){
        return "rest2";
    }
}
