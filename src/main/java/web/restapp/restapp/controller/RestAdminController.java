package web.restapp.restapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import web.restapp.restapp.controller.dto.UserDto;
import web.restapp.restapp.model.Role;
import web.restapp.restapp.model.User;
import web.restapp.restapp.service.RoleService;
import web.restapp.restapp.service.UserService;

import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/admin")
public class RestAdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private RoleService roleService;

    @Autowired
    PasswordEncoder bCryptPasswordEncoder;

    @GetMapping
    public ResponseEntity<List<User>> allUser(){
        List<User> userList = userService.listUsers();
        return userList != null &&  !userList.isEmpty()
                ? new ResponseEntity<>(userList, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);

    }
    @GetMapping(value = "/user/{id}")
    public ResponseEntity<User> read(@PathVariable(name = "id") Long id) {
        User user = userService.findUserById(id);

        return user != null
                ? new ResponseEntity<>(user, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody UserDto userDto){
        User user = fromDto(userDto);
        userService.saveUser(user);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> remove(@PathVariable("id") Long id){
        boolean deleted = userService.deleteUser(id);
        return deleted
                ? new ResponseEntity<>(HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_MODIFIED);
    }

//    @GetMapping("/{id}/edit")
//    public String editUser(@PathVariable("id") Long id, Model model){
//        User user = userService.findUserById(id);
//        UserDto dto = toDto(user);
//
//        model.addAttribute("user", dto);
//
//        return "edit";
//    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable("id") Long id, @RequestBody UserDto userDto) {
        User user = fromDto(userDto);
        user.setId(id);
        userService.updateUser(user);


        return new ResponseEntity<>(HttpStatus.OK);
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

//    @GetMapping("/rest")
//    public String getRest(){
//        return "rest1";
//    }
}
