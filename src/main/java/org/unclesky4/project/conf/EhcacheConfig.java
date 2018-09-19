package org.unclesky4.project.conf;

import org.springframework.cache.annotation.CachingConfigurerSupport;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.Configuration;

/**
 * 启用自定义的Key生成策略
 * @author unclesky4 2019.09.18
 *
 */
@Configuration
public class EhcacheConfig extends CachingConfigurerSupport {

	@Override
    public KeyGenerator keyGenerator() {
		System.out.println("启用自定义的Key生成策略");
        return new CustomKeyGenerator();
    }

}
