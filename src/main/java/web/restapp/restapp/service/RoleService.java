package web.restapp.restapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import web.restapp.restapp.model.Role;
import web.restapp.restapp.repositories.RoleRepository;

@Service
public class RoleService {

    @Autowired
    private RoleRepository repository;

    public Role findByRoleName(String roleName) {
        return repository.findByRole(roleName);

    }



}
