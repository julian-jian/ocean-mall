import http from '../../utils/http.js'

// 获取用户信息
export const getPeopleInfo =()=>{
	return http.request({
		url:'/sso/info',
		method:'GET',
	})
}

// 获取收藏列表
export const getColletList =(obj)=>{
	return http.request({
		url:'/member/productCollection/list',
		method:'GET',
		data:obj
	})
}

// 取消收藏
export const closeCollerList=(id)=>{
	return http.request({
		method:"POST",
		url:`/member/productCollection/delete`,
		data:id
	})
}
