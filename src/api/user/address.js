import http from '../../utils/http.js'


// 获取所有地址
export const getAddressList=function(){
	return http.request({
		url:'/member/address/list',
		method:'GET'
	})
}

// 新增地址 
export const getAddress=function(obj){
	return http.request({
		url:'/member/address/add',
		method:'post',
		data:obj
	})
}

// 修改
export const getUpdate=function(obj,id){
	return http.request({
		url:`/member/address/update/${id}`,
		method:'POST',
		data:obj
	})
}

// 删除
export const getDelete=function(id){
	return http.request({
		url:`/member/address/delete/${id}`,
		method:'POST'
	})
}