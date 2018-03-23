package org.unclesky4.project.conf;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@EnableJpaRepositories(basePackages = "org.unclesky4.project.dao")
@EntityScan(basePackages = "org.unclesky4.project.entity")
public class JpaConfig {}