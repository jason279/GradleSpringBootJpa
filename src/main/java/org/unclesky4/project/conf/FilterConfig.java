package org.unclesky4.project.conf;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import net.sf.ehcache.constructs.web.filter.GzipFilter;
import net.sf.ehcache.constructs.web.filter.SimplePageCachingFilter;

/**
 * ehcache Filter
 * @author Huang Zhibiao 2018/03/13
 *
 */
@Configuration
public class FilterConfig {

	 /**
	* 配置ehcache的Gzip压缩
	* @return
	*/
	@Bean
	public FilterRegistrationBean<GzipFilter> gzipFilter(){
		FilterRegistrationBean<GzipFilter> gzipFilter = new FilterRegistrationBean<GzipFilter>(new GzipFilter());
		String[] arrs = {"*.js","*.css","*.json","*.html"};
		gzipFilter.setUrlPatterns(Arrays.asList(arrs));
		return gzipFilter;
	}
	/**
	* 配置页面缓存,页面缓存会自动开启GZIP压缩
	*/
	@Bean
	public FilterRegistrationBean<SimplePageCachingFilter> helloFilter(){
		FilterRegistrationBean<SimplePageCachingFilter> helloFilter = new FilterRegistrationBean<SimplePageCachingFilter>(new SimplePageCachingFilter());
		Map<String,String> maps = new HashMap<>();
		//设置参数
		maps.put("cacheName","pages");
		helloFilter.setInitParameters(maps);
		//设置路径
		String[] arrs = {"/pages_cache"};
		helloFilter.setUrlPatterns(Arrays.asList(arrs));
		return helloFilter;
	}

}
