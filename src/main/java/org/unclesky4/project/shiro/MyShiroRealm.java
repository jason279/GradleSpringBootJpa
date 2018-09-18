package org.unclesky4.project.shiro;

import java.util.List;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.mgt.RealmSecurityManager;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.unclesky4.project.entity.Permission;
import org.unclesky4.project.entity.Role;
import org.unclesky4.project.entity.User;
import org.unclesky4.project.service.RoleService;
import org.unclesky4.project.service.UserService;


/**
 * 身份校验,过滤条件 --核心类
 * @author clouder
 * 
 * 
    1、检查提交的进行认证的令牌信息
    2、根据令牌信息从数据源(通常为数据库)中获取用户信息
    3、对用户信息进行匹配验证。
    4、验证通过将返回一个封装了用户信息的AuthenticationInfo实例。
    5、验证失败则抛出AuthenticationException异常信息。

 *
 */
public class MyShiroRealm extends AuthorizingRealm{
	
	private static Logger logger = LoggerFactory.getLogger(MyShiroRealm.class);

	//用于用户查询
	@Autowired
	private UserService userService;
	
	//用于查询角色权限
	@Autowired
	private RoleService roleService;
	
	//角色和对应权限添加 - 例中该方法的调用时机为需授权资源被访问时
	@Override
	protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
		System.out.println("权限配置-->MyShiroRealm.doGetAuthorizationInfo()");
		//获取登录User
		String email = (String) principalCollection.getPrimaryPrincipal();
		
		User user = userService.findByEmail(email);
		if(user == null) {
			return null;
		}
		//添加角色和权限
		SimpleAuthorizationInfo simpleAuthorizationInfo = new SimpleAuthorizationInfo();
		for (Role role:user.getRoles()) {
            //添加角色
            simpleAuthorizationInfo.addRole(role.getRoleName());
            Role tmp = roleService.findById(role.getId());
            List<Permission> permissions = null;
            if(tmp != null) {
            	permissions = tmp.getPermissions();
            }
            for (Permission permission : permissions) {
                //添加权限
                simpleAuthorizationInfo.addStringPermission(permission.getPermission());
            }
        }
		return simpleAuthorizationInfo;
	}

	//用户认证 -- 验证用户输入的账号是否存在
	@Override
	protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
        UsernamePasswordToken utoken = (UsernamePasswordToken) token;

        String username = utoken.getUsername();
        
        User user = userService.findByEmail(username);
        
        if(user == null) {
        	return null;
        }
        System.out.println("code:"+user.getCode());
    	//放入shiro.调用CredentialsMatcher检验密码
        SimpleAuthenticationInfo simpleAuthenticationInfo = new SimpleAuthenticationInfo(username, user.getPassword(), getName());
        return simpleAuthenticationInfo;
	}
	
	public void clearAuthz(){
		this.clearCachedAuthorizationInfo(SecurityUtils.getSubject().getPrincipals());
	}
	
	/**
	 * shiro刷新权限
	 */
	public static void reloadAuthorizing() {
        logger.info("权限刷新成功");
        
		RealmSecurityManager rsm = (RealmSecurityManager)SecurityUtils.getSecurityManager();
		MyShiroRealm realm = (MyShiroRealm)rsm.getRealms().iterator().next();
		realm.clearAuthz();
	}

}
