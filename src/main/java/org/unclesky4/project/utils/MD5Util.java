package org.unclesky4.project.utils;

import java.security.MessageDigest;
public class MD5Util {
	
	public static String MD5(String key) {
		//  'o', 'n', 'e', 'c', 'l', 'o', 'u', 'd', '/', '!', '@', '#', '$', '1', '6', '8'
        char hexDigits[] = {
                'o', 'n', 'e', 'c', 'l', 'o', 'u', 'd', '/', '!', '@', '#', '$', '1', '6', '8'
        };
        try {
            byte[] btInput = key.getBytes();
            // 获得MD5摘要算法的 MessageDigest 对象
            MessageDigest mdInst = MessageDigest.getInstance("MD5");
            // 使用指定的字节更新摘要
            mdInst.update(btInput);
            // 获得密文
            byte[] md = mdInst.digest();
            // 把密文转换成十六进制的字符串形式
            int j = md.length;
            char str[] = new char[j * 2];
            int k = 0;
            for (int i = 0; i < j; i++) {
                byte byte0 = md[i];
                str[k++] = hexDigits[byte0 >>> 4 & 0xf];
                str[k++] = hexDigits[byte0 & 0xf];
            }
            return new String(str);
        } catch (Exception e) {
            return null;
        }
    }
	
	public static void main(String[] args) {
		String result = MD5Util.MD5("123456"); // 6no@1$c!l!#@o!@##6ou6ood8eo8//c6
		System.out.println(result.length());
		System.out.println(result);
	}
}
