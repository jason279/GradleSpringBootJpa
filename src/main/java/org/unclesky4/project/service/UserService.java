package org.unclesky4.project.service;

import java.util.List;

import org.unclesky4.project.entity.User;

public interface UserService {
	
	User findById(Long id);
	
	User findByEmail(String email);
	
	void deleteById(Long id);
	
	List<User> list();
}
