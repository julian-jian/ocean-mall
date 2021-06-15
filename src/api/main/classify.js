import http from '../../utils/http.js'

// 获取首页分类列表
export const classifyList =(value)=>{
	return http.request({
		url:`/home/productCateList/${value}`,
		method:'GET'
	})
}

// 获取分类树木
export const categoryTreeList =()=>{
	return http.request({
		url:`/product/categoryTreeList`,
		method:'GET'
	})
}

// 获取分类点击后产生的商品页面
export const getClassifyResultList=(obj)=>{
	return http.request({
		url:'/product/search',
		method:'GET',
		data:obj
	})
}
