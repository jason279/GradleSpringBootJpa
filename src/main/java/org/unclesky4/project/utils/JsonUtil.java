package org.unclesky4.project.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class JsonUtil {
	
	public static String toJson(Object object) throws JsonProcessingException {
		
		ObjectMapper mapper = new ObjectMapper();
		String result = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(object);
		return result;
	}
	
}
