package org.unclesky4.project.conf;

import java.lang.reflect.Method;
import java.util.Arrays;

import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.Configuration;

/**
 * 自定义ehcache的key生成策略
 * @author unclesky4  2019.09.18
 *
 */
@Configuration
public class CustomKeyGenerator implements KeyGenerator {

	@Override
	public Object generate(Object target, Method method, Object... params) {
		return null;
	}

	static final class CustomKey {
		private final Class<?> clazz;
		private final String methodName;
		private final Object[] params;
		private final int hashCode;

		/**
		 * * Initialize a key. * * 
		 * @param clazz the receiver class
		 * @param methodName the method name
		 * @param params the method parameters
		 */
		CustomKey(Class<?> clazz, String methodName, Object[] params) {
			this.clazz = clazz;
			this.methodName = methodName;
			this.params = params;
			int code = Arrays.deepHashCode(params);
			code = 31 * code + clazz.hashCode();
			code = 31 * code + methodName.hashCode();
			this.hashCode = code;
		}

		@Override
		public int hashCode() {
			return this.hashCode;
		}

		@Override
		public boolean equals(Object obj) {
			if (this == obj) {
				return true;
			}
			if (!(obj instanceof CustomKey)) {
				return false;
			}
			CustomKey other = (CustomKey) obj;
			if (this.hashCode != other.hashCode) {
				return false;
			}
			return this.clazz.equals(other.clazz) && this.methodName.equals(other.methodName)
					&& Arrays.deepEquals(this.params, other.params);
		}
	}

}
