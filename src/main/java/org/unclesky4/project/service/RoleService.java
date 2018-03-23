package org.unclesky4.project.service;

import java.util.List;

import org.unclesky4.project.entity.Role;

public interface RoleService {

	Role findById(Long id);
	
	void deleteById(Long id);
	
	List<Role> list();
	
}
