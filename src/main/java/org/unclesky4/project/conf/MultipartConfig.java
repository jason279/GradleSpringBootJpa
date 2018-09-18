package org.unclesky4.project.conf;

import javax.servlet.MultipartConfigElement;

import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Configuration;

/**
 * 上传文件大小的配置
 * @author unclesky4
 *
 */
@Configuration
public class MultipartConfig {
	
	public MultipartConfigElement multipartConfigElement() {
		MultipartConfigFactory factory = new MultipartConfigFactory();
		   //  单个数据大小
		   factory.setMaxFileSize("102400KB");
		   /// 总上传数据大小
		   factory.setMaxRequestSize("102400KB");
		   return factory.createMultipartConfig();
	}

}
