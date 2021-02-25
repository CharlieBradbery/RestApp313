package web.restapp.restapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import web.restapp.restapp.controller.dto.UserDto;
import web.restapp.restapp.model.Role;
import web.restapp.restapp.model.User;
import web.restapp.restapp.service.RoleService;
import web.restapp.restapp.service.UserService;

import java.util.stream.Collectors;


@Controller
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private RoleService roleService;

    @Autowired
    PasswordEncoder bCryptPasswordEncoder;

    @GetMapping
    public String allUserShow(Model model, Authentication authentication){
        User user = (User) authentication.getPrincipal();

        UserDto userDto = new UserDto();
        userDto.setEmail(user.getEmail());
        userDto.setRoles(user.getRoles().stream().map(Role::getRole).collect(Collectors.toSet()));

        model.addAttribute("currentUser", userDto);
        model.addAttribute("newUser", new UserDto());
        model.addAttribute("users", userService.listUsers().stream().map(AdminController::toDto).collect(Collectors.toList()));
        return "users";
    }

    @PostMapping
    public String create(@ModelAttribute("user") UserDto userDto){
        User user = fromDto(userDto);
        userService.saveUser(user);
        return "redirect:/admin";
    }

    @DeleteMapping("/{id}")
    public String removeUser(@PathVariable("id") Long id){
        userService.deleteUser(id);
        return "redirect:/admin";
    }

    @GetMapping("/{id}/edit")
    public String editUser(@PathVariable("id") Long id, Model model){
        User user = userService.findUserById(id);
        UserDto dto = toDto(user);

        model.addAttribute("user", dto);

        return "edit";
    }

    @PostMapping("/{id}")
    public String update(@PathVariable("id") Long id, @ModelAttribute("user") UserDto userDto) {
        User user = fromDto(userDto);
        user.setId(id);
        userService.updateUser(user);
        return "redirect:/admin";
    }


    private User fromDto(UserDto userDto) {
        User user = new User();

        user.setFirstname(userDto.getFirstname());
        user.setLastname(userDto.getLastname());
        user.setAge(userDto.getAge());
        user.setPassword(bCryptPasswordEncoder.encode(userDto.getPassword()));
        user.setEmail(userDto.getEmail());
        user.setRoles(userDto.getRoles() == null ? null : userDto.getRoles().stream()
                .map(roleService::findByRoleName)
                .collect(Collectors.toSet())
        );
        return user;
    }
    private static UserDto toDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setFirstname(user.getFirstname());
        dto.setLastname(user.getLastname());
        dto.setPassword(user.getPassword());
        dto.setAge(user.getAge());
        dto.setEmail(user.getEmail());
        dto.setRoles(user.getRoles() == null ? null : user.getRoles().stream()
                .map(Role::getRole)
                .collect(Collectors.toSet()));
        return dto;
    }
}
