package org.unclesky4.project.dao;

import static org.junit.Assert.fail;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
public class UserRepositoryTest {
	
	@Autowired
	private UserRepository userDao;

	@Test
	public void testFindByPhone() {
		userDao.findByPhone("18814383363");
	}

	@Test
	public void testFindByEmail() {
		fail("Not yet implemented");
	}

}
