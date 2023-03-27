/** 请求服务的环境配置 */
type ServiceEnv = Record<ServiceEnvType, ServiceEnvConfig>;

/** 不同请求服务的环境配置 */
const serviceEnv: ServiceEnv = {
  dev: {
    url: 'http://124.221.252.113:19008/yousu-admin',
    // url: 'http://127.0.0.1:19008/yousu-admin',
    urlPattern: '/api',
    secondUrl: 'http://localhost:8081',
    secondUrlPattern: '/second-url-pattern'
  },
  test: {
    url: '/yousu-admin',
    urlPattern: '/api',
    secondUrl: 'http://localhost:8081',
    secondUrlPattern: '/second-url-pattern'
  },
  prod: {
		// url: 'http://localhost:8080',
		// url: 'https://admin.umovestglobal.com/yousu-admin',
    // urlPattern: '/url-pattern',
		url: '/yousu-admin',
		urlPattern: '/api',
    secondUrl: 'http://localhost:8081',
    secondUrlPattern: '/second-url-pattern'
  }
};

/**
 * 获取当前环境模式下的请求服务的配置
 * @param env 环境
 */
export function getServiceEnvConfig(env: ImportMetaEnv) {
  const { VITE_SERVICE_ENV = 'dev' } = env;

  const config = serviceEnv[VITE_SERVICE_ENV];

  return config;
}
