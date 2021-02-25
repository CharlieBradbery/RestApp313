package web.restapp.restapp.controller.dto;

import java.util.Set;


public class UserDto {

    private Long id;
    private String firstname;
    private String lastname;
    private String password;
    private int age;
    private String email;
    private Set<String> roles;

    public UserDto() {}

    public UserDto(Long id, String firstname, String lastname, String password, int age, String email, Set<String> roles) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.password = password;
        this.age = age;
        this.email = email;
        this.roles = roles;
    }

    public Long getId() {return id;}

    public void setId(Long id) {this.id = id;}

    public String getFirstname() {return firstname;}

    public void setFirstname(String firstname) {this.firstname = firstname; }

    public String getLastname() {return lastname;}

    public void setLastname(String lastname) {this.lastname = lastname;}

    public void setPassword(String password) {this.password = password;}

    public String getPassword() {return password; }

    public int getAge() { return age; }

    public void setAge(int age) {this.age = age;}

    public String getEmail() {return email;}

    public void setEmail(String email) {this.email = email;}

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }

    @Override
    public String toString() {
        return "UserDto{" +
                "id=" + id +
                ", firstname='" + firstname + '\'' +
                ", lastname='" + lastname + '\'' +
                ", password='" + password + '\'' +
                ", age=" + age +
                ", email='" + email + '\'' +
                ", roles=" + roles +
                '}';
    }
}
