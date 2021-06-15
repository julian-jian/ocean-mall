// 导入请求插件
import Request from "./request/index.js";

// 实例初始化
const http = new Request();

// 引入vuex
import store from "../store/index.js";

// 设置默认参数
http.setConfig((config) => {
	config.baseURL = "https://app.zhihaiocean.com/portal/api";
	// config.baseURL = 'https://b.hapondtech.com/api';
	// config.baseURL = 'http://118.24.13.29:8081';// 测试使用的地址
	// config.baseURL = 'http://192.168.1.16:8081';
	// config.baseURL = 'http://127.0.0.1:8081';
	// config.baseURL = 'http://192.168.8.102:8082';
	// config.baseURL = "http://xqkb8e.natappfree.cc/portal/api";
	// config.baseURL = "https://app-test.geeked.top/portal";
	// config.baseURL = "http://rpmcyy.natappfree.cc"
	return config;
});

// 发送请求设置拦截
http.interceptors.request.use(
	(config) => {
		// 判断本地是否存在登陆状态
		config.header = {
			...config.header,
			Authorization: `Bearer ${store.state.user.token}`,
			// Authorization:`Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJvLTJLTTVYcGp0OFA0bXl5M0dOcUNKVUdOeDdZIiwiY3JlYXRlZCI6MTU5NjA5NDU0MTAxOSwiZXhwIjoxNTk2Njk5MzQxfQ.UYqinV09tA9yAKz460QXD5XyC02unylUTC5EaLsvjnoKjrfkZDUL_mA3OfsCTROLDjqawSyB2H3AacslnGfbQg`,
			// Authorization:`Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJvLTJLTTVkNzBobU5fYW11NVU2ZFg0Tmw3U0tzIiwiY3JlYXRlZCI6MTU5NjQzOTYyMDkyNSwiZXhwIjoxNTk3MDQ0NDIwfQ.Z9k3AKmg21rytvKpPfGB59dA8TTPYA3PEp0EWKuVLssmj8SGsiS47SXX_2d9sksvB3M2Njp9itPpNKiCThsQ8A`,
		};
		// console.log(config)
		return config;
	},
	(config) => {
		return Promise.reject(config);
	}
);

//响应时候的拦截
http.interceptors.response.use(
	(response) => {
		// uni.showToast({
		//     title: '标题',
		//     duration: 2000,
		// 	icon:'none'
		// });
		// console.log(response.data)
		if (response.data.code != 200) {
			if (
				response.data.message != "暂未登录或token已经过期" &&
				response.data.message != "token已经过期！"
			) {
				console.log(response.data.message);
				uni.showToast({
					title: response.data.message,
					duration: 1000,
					icon: "none",
				});
			}
		}
		return response;
	},
	(response) => {
		uni.showToast({
			title: "内部错误，请联系开发者",
			duration: 1000,
			icon: "none",
		});
		return Promise.reject(response);
	}
);

// 进行初始化配置
export default http;
