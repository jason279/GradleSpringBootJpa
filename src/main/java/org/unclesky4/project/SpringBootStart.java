package org.unclesky4.project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * 启动类
 * @author unclesky4
 *
 *
 * 继承SpringBootServletInitializer，重写configure，支持打包程序到外部tomcat运行
 */
@EnableAutoConfiguration
@EnableCaching
@SpringBootApplication
@EnableTransactionManagement
public class SpringBootStart extends SpringBootServletInitializer{

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
		return builder.sources(SpringBootStart.class);
	}

	public static void main(String[] args) {
		SpringApplication.run(SpringBootStart.class, args);
	}

}
