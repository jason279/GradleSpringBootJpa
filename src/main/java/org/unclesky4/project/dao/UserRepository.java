package org.unclesky4.project.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.unclesky4.project.entity.User;


@Repository
public interface UserRepository extends JpaRepository<User, Long> {

	User findByPhone(String phone);
	
	User findByEmail(String email);
}
