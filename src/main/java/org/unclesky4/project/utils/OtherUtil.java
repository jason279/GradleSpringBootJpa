package org.unclesky4.project.utils;

import java.io.File;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class OtherUtil {
	
	/**
	 * 字符串不为空
	 */
	public static boolean isNotEmpty(String name) {
		if(name!=null && !name.isEmpty()) return true;
		return false;
	}
	
	/**
	 * 页面提示信息
	 * @param status 0正常1错误2异常
	 * @param mess 信息
	 */
	public static ObjectNode message(int status, String mess) {
		ObjectMapper mapper = new ObjectMapper();
		ObjectNode jsonNode = mapper.createObjectNode();
		jsonNode.put("status", status);
		jsonNode.put("mess", mess);
		return jsonNode;
	}
	/**
	 * 页面提示信息
	 * @param status 0正常1错误2异常
	 * @param mess 信息
	 * @return json object
	 */
	public static ObjectNode message(int status, String mess,JsonNode json) {
		ObjectMapper mapper = new ObjectMapper();
		ObjectNode jsonNode = mapper.createObjectNode();
		jsonNode.put("status", status);
		jsonNode.put("mess", mess);
		jsonNode.putPOJO("js", json);
		return jsonNode;
	}
	
	/**
	 * 去除list里相同的内容
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public static List removeDuplicate(List list) {
		Set set = new HashSet();
		List newList = new ArrayList();
		for (Iterator iter = list.iterator(); iter.hasNext();) {
			Object element = iter.next();
			if (set.add(element))
				newList.add(element);
		}
		return newList;
	}
    
    /**
     * 递归删除目录下的所有文件及子目录下所有文件及该目录
     * @param dir
     * @return
     */
    public static boolean deleteDir(File dir) {
    	if (dir.isDirectory()) {
        	String[] children = dir.list();
        	for (int i=0; i<children.length; i++) {
        		boolean success = deleteDir(new File(dir, children[i]));
            	if (!success) {
                return false;
            	}
        	}
    	}
    	return dir.delete();
    }
}


