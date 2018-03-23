package org.unclesky4.project.service.impl;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.unclesky4.project.dao.UserRepository;
import org.unclesky4.project.entity.User;
import org.unclesky4.project.service.UserService;

@Service
public class UserServiceImpl implements UserService {
	
	@Autowired
	private UserRepository userDao;

	@Override
	public User findById(Long id) {
		return userDao.getOne(id);
	}

	@Override
	public User findByEmail(String email) {
		return userDao.findByEmail(email);
	}

	@Override
	public void deleteById(Long id) {
		userDao.deleteById(id);
	}

	@Override
	public List<User> list() {
		return userDao.findAll();
	}

}
