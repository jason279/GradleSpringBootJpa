package org.unclesky4.project.controller;

import javax.validation.constraints.Email;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import org.unclesky4.project.exception.MyException;

@RestController
public class UserController {
	
	@RequestMapping(path = "/", method = RequestMethod.GET) 
	public ModelAndView login() { 
		ModelAndView mv = new ModelAndView("login.html"); 
		mv.getModel().put("status", "");
		return mv; 
	}
	
	@RequestMapping(path = "/login", method = RequestMethod.GET) 
	public ModelAndView login_redirect() { 
		ModelAndView mv = new ModelAndView("login.html");
		mv.getModel().put("status", "");
		return mv; 
	}
	
	@RequestMapping(path = "/login", method = RequestMethod.POST) 
	public ModelAndView loginByEmail(@Email String email, String password, Boolean rememberMe) {
		if(password == null) {
			throw new MyException("100","密码不能为空");
			
		}
		ModelAndView modelAndView = new ModelAndView();
		rememberMe = false;
		UsernamePasswordToken token = new UsernamePasswordToken(email, password);
		token.setRememberMe(rememberMe);
		
		Subject subject = SecurityUtils.getSubject();
		
		try {
			subject.login(token);
		} catch (AuthenticationException e) {
			e.printStackTrace();
			modelAndView.setViewName("login.html");
			return modelAndView;
		}
		modelAndView.setViewName("index.html");
		subject.getSession().setAttribute("username", email);
		//有效时间30分钟
		subject.getSession().setTimeout(30*60*1000);
		//System.out.println(subject.getSession().getAttribute("username")+ " " +subject.getSession().getTimeout());
		
		return modelAndView;
	}

}
