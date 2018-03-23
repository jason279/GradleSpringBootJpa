package org.unclesky4.project.shiro;

import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authc.credential.SimpleCredentialsMatcher;
import org.unclesky4.project.utils.MD5Util;


public class CredentialsMatcher extends SimpleCredentialsMatcher{

	 @Override
	   public boolean doCredentialsMatch(AuthenticationToken token, AuthenticationInfo info) {
  
		UsernamePasswordToken utoken=(UsernamePasswordToken) token;
        //获得用户输入的密码:(可以采用加盐(salt)的方式去检验)
        String inPassword = new String(utoken.getPassword());
        //System.out.println("inPassword:"+inPassword);
        
        //获得密码
        String dbPassword=(String) info.getCredentials();
        //System.out.println("dbPassword:"+dbPassword);
        //System.out.println(this.equals(MD5Util.MD5(inPassword), dbPassword));
        //进行密码的比对
        return this.equals(MD5Util.MD5(inPassword), dbPassword);
	 }
}
