package org.unclesky4.project.conf;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;

import com.alibaba.druid.support.http.StatViewServlet;
import com.alibaba.druid.support.http.WebStatFilter;

/**
 * 
 * @author Huang Zhibiao  2018/03/13
 *
 */
public class DruidConfig {

	/**
	* druid监控
	* @return
	*/
	@Bean
	public ServletRegistrationBean<StatViewServlet> druidServlet() {
		ServletRegistrationBean<StatViewServlet> reg = new ServletRegistrationBean<StatViewServlet>();
		reg.setServlet(new StatViewServlet());
		reg.addUrlMappings("/druid/*");
		//reg.addInitParameter("allow", "127.0.0.1");
		//reg.addInitParameter("deny","");
		reg.addInitParameter("loginUsername", "uncle");
		reg.addInitParameter("loginPassword", "uncle");
		return reg;
	}
	/**
	* druid监控过滤
	* @return
	*/
	@Bean
	public FilterRegistrationBean<WebStatFilter> filterRegistrationBean() {
		FilterRegistrationBean<WebStatFilter> filterRegistrationBean = new FilterRegistrationBean<WebStatFilter>();
		filterRegistrationBean.setFilter(new WebStatFilter());
		filterRegistrationBean.addUrlPatterns("/*");
		filterRegistrationBean.addInitParameter("exclusions", "*.js,*.gif,*.jpg,*.png,*.css,*.ico,/druid/*");
		return filterRegistrationBean;
	}
}
