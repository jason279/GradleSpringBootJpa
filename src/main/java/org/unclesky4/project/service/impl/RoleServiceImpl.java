package org.unclesky4.project.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.unclesky4.project.dao.RoleRepository;
import org.unclesky4.project.entity.Role;
import org.unclesky4.project.service.RoleService;

@Service
public class RoleServiceImpl implements RoleService {
	
	@Autowired
	private RoleRepository roleDao;

	@Override
	public Role findById(Long id) {
		return roleDao.getOne(id);
	}

	@Override
	public void deleteById(Long id) {
		roleDao.deleteById(id);
		
	}

	@Override
	public List<Role> list() {
		return roleDao.findAll();
	}

}
