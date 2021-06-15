import http from '../../utils/http.js'

// 登录
export const getLogin =(obj)=>{
	return http.request({
		url:'/wx/login',
		method:'POST',
		data:obj
	})
}

// 更新token
export const refreshToken =()=>{
	return http.request({
		url:'/sso/refreshToken',
		method:'GET'
	})
}