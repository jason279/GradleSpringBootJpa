package org.unclesky4.project.utils;

import java.text.Format;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DateUtil {

	public static Format YMDHMS = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	public static Format YMD = new SimpleDateFormat("yyyy-MM-dd");
    
	/**
	 * 将时间转换为2015-06-19 11:38:13格式
	 */
	public static String DateToString(Format ft,Date date) {
		if(date == null) return null;
		return ft.format(date);
	}
	
	/**
	 * 将时间戳转换为2015-06-19 11:38:13格式
	 */
	public static String DateToString(Format ft,long date) {
		return ft.format(date);
	}
	
	/**
	 * 将long型或者2015-06-19 11:38:13格式字符串转换为时间
	 * @return 失败返回null
	 */
	public static Date stringToDate(Format ft,String str) {
		try {
			long time = Long.parseLong(str);
			return new Date(time);
		} catch(Exception e) {
			try {
				return (Date) ft.parseObject(str);
			} catch (Exception e1) {}
		}
		return null;
	}
	
	/**
	 * 将long型时间差转换为中文具体时间
	 */
	public static String LongToDuration(long diff){
		long days = diff / (1000 * 60 * 60 * 24);
		long hours = (diff-days*(1000 * 60 * 60 * 24))/(1000* 60 * 60);
		long minutes = (diff-days*(1000 * 60 * 60 * 24)-hours*(1000* 60 * 60))/(1000* 60);
		long seconds = (diff-days*(1000 * 60 * 60 * 24)-hours*(1000* 60 * 60)-minutes*(1000*60))/1000;
		return ""+days+"天"+hours+"小时"+minutes+"分"+seconds+"秒"; 
	}
}
