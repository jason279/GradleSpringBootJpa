package org.unclesky4.project.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.unclesky4.project.entity.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

}
