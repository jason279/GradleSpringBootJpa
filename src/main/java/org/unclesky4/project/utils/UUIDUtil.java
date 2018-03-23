package org.unclesky4.project.utils;

import java.util.UUID;

/**
 * 
 * @author HUang Zhibiao 2018/03/14
 *
 */
public class UUIDUtil {
	
	public static String getUUID() {
		return UUID.randomUUID().toString().replaceAll("-", "");
	}

}
