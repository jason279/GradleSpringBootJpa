package org.unclesky4.project.conf;

import java.util.LinkedHashMap;
import java.util.Map;

import org.apache.shiro.mgt.SecurityManager;
import org.apache.shiro.spring.security.interceptor.AuthorizationAttributeSourceAdvisor;
import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.web.mgt.DefaultWebSecurityManager;
import org.springframework.aop.framework.autoproxy.DefaultAdvisorAutoProxyCreator;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.unclesky4.project.shiro.CredentialsMatcher;
import org.unclesky4.project.shiro.MyShiroRealm;


@Configuration
public class ShiroConfig {

	/** 
     * ShiroFilterFactoryBean 处理拦截资源文件问题。 
     * 注意：单独一个ShiroFilterFactoryBean配置是或报错的，因为在 
     * 初始化ShiroFilterFactoryBean的时候需要注入：SecurityManager 
     * 
        Filter Chain定义说明 
       1、一个URL可以配置多个Filter，使用逗号分隔 
       2、当设置多个过滤器时，全部验证通过，才视为通过 
       3、部分过滤器可指定参数，如perms，roles 
     * 
     */  
    @Bean  
    public ShiroFilterFactoryBean shirFilter(SecurityManager securityManager){  
    	ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean(); 

    	// 必须设置 SecurityManager 
		shiroFilterFactoryBean.setSecurityManager(securityManager); 
		// 如果不设置默认会自动寻找Web工程根目录下的"/login.jsp"页面 
		shiroFilterFactoryBean.setLoginUrl("/login"); 
		// 登录成功后要跳转的链接 
		shiroFilterFactoryBean.setSuccessUrl("/index"); 
		// 未授权界面; 
		shiroFilterFactoryBean.setUnauthorizedUrl("/403"); 
		// 拦截器. 
		Map<String, String> filterChainDefinitionMap = new LinkedHashMap<String, String>(); 
		filterChainDefinitionMap.put("/*", "anon");
		// 配置不会被拦截的链接 顺序判断 
		filterChainDefinitionMap.put("/public/**", "anon");
		filterChainDefinitionMap.put("/static/**", "anon");
		filterChainDefinitionMap.put("/ajaxLogin", "anon");
		filterChainDefinitionMap.put("/user/login", "anon");
		// 配置退出过滤器,其中的具体的退出代码Shiro已经替我们实现了 
		filterChainDefinitionMap.put("/logout", "logout");
		
		// <!-- 过滤链定义，从上向下顺序执行，一般将 /**放在最为下边 -->:这是一个坑呢，一不小心代码就不好使了; 
		// <!-- authc:所有url都必须认证通过才可以访问; anon:所有url都都可以匿名访问--> 
		filterChainDefinitionMap.put("/**", "authc"); 
		shiroFilterFactoryBean.setFilterChainDefinitionMap(filterChainDefinitionMap); 
		System.out.println("Shiro拦截器工厂类注入成功"); 
		return shiroFilterFactoryBean;
    	
		/*System.out.println("ShiroConfiguration.shirFilter()");  
       ShiroFilterFactoryBean shiroFilterFactoryBean  = new ShiroFilterFactoryBean();  
        
        // 必须设置 SecurityManager   
       shiroFilterFactoryBean.setSecurityManager(securityManager);  
        
       //拦截器.  
       Map<String,String> filterChainDefinitionMap = new LinkedHashMap<String,String>();  
        
       //配置退出过滤器,其中的具体的退出代码Shiro已经替我们实现了  
       filterChainDefinitionMap.put("/logout", "logout");  
        
       //<!-- 过滤链定义，从上向下顺序执行，一般将 /**放在最为下边 -->:这是一个坑呢，一不小心代码就不好使了;  
        //<!-- authc:所有url都必须认证通过才可以访问; anon:所有url都都可以匿名访问-->  
       filterChainDefinitionMap.put("/**", "authc");  
        
       // 如果不设置默认会自动寻找Web工程根目录下的"/login.jsp"页面  
        shiroFilterFactoryBean.setLoginUrl("/login");  
        // 登录成功后要跳转的链接  
        shiroFilterFactoryBean.setSuccessUrl("/index"); 
        //未授权界面;  
        shiroFilterFactoryBean.setUnauthorizedUrl("/403");  
        
       shiroFilterFactoryBean.setFilterChainDefinitionMap(filterChainDefinitionMap);  
       return shiroFilterFactoryBean;*/
    }  
    
    //配置自定义的权限登录器
    @Bean
    public MyShiroRealm myShiroRealm(){
        MyShiroRealm myShiroRealm = new MyShiroRealm();
        myShiroRealm.setCredentialsMatcher(credentialsMatcher());
        return myShiroRealm;
    }
    
    //开启Shiro的注解(如@RequiresRoles,@RequiresPermissions) -start
    @Bean
    public AuthorizationAttributeSourceAdvisor authorizationAttributeSourceAdvisor() {
        AuthorizationAttributeSourceAdvisor authorizationAttributeSourceAdvisor
            = new AuthorizationAttributeSourceAdvisor();
        authorizationAttributeSourceAdvisor.setSecurityManager(securityManager());
        return authorizationAttributeSourceAdvisor;
    }
    @Bean
    @ConditionalOnMissingBean
    public DefaultAdvisorAutoProxyCreator defaultAdvisorAutoProxyCreator() {
        DefaultAdvisorAutoProxyCreator defaultAAP = new DefaultAdvisorAutoProxyCreator();
        defaultAAP.setProxyTargetClass(true);
        return defaultAAP;
    }
  //开启Shiro的注解(如@RequiresRoles,@RequiresPermissions)-end
    
    //配置自定义的密码比较器
    @Bean
    public CredentialsMatcher credentialsMatcher() {
        return new CredentialsMatcher();
    }
    
    //配置核心安全事务管理器
    @Bean
    public SecurityManager securityManager(){  
       DefaultWebSecurityManager securityManager =  new DefaultWebSecurityManager();
       securityManager.setRealm(myShiroRealm());
       return securityManager;  
    }
}
