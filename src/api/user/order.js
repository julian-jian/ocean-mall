import http from '../../utils/http.js'

export const getOrder=function(number){
	return http.request({
		url:'/order/list',
		method:'GET',
		data:number
	})
}

// 退款申请
export const returnApply=(obj)=>{
	return http.request({
		url:'/returnApply/create',
		method:"POST",
		data:obj
	})
}

//获取退款列表
export const getReturnApplyList=(obj)=>{
	return http.request({
		url:'/returnApply/list',
		method:"GET",
		data:obj
	})
}

// 获取订单详情
export const getReturnDefault=(id)=>{
	return http.request({
		url:`/returnApply/get/${id}`,
		method:'GET'
	})
}

// 用户删除记录
export const delReturnList=(id)=>{
	return http.request({
		url:`/returnApply/userDelete/${id}`,
		method:'GET'
	})
}

// 用户确认收货
export const confirmReceiveOrder=(obj)=>{
	return http.request({
		method:'POST',
		url:'/order/confirmReceiveOrder',
		params:obj,
	})
}

// 用户删除记录
export const delReturnApply=(id)=>{
	return http.request({
		method:'GET',
		url:`/returnApply/delete/${id}`
	})
}

// 获取物流详情
export const getExpress=(id)=>{
	return http.request({
		method:'GET',
		url:`/order/getExpress/${id}`
	})
}

// 设置未付款的取消订单
export const cancelUserOrder=(id)=>(
	http.request({
		method:'POST',
		url:`/order/cancelUserOrder/${id}`
	})
)

// 更新退货信息
export const updataReturn=(obj)=>(
	http.request({
		method:'POST',
		url:`/returnApply/update`,
		data:obj
	})
)

// 设置订单设置接口
export const orderDetail=(orderId)=>(
	http.request({
		method:'GET',
		url:`/order/detail/${orderId}`
	})
)

// 设置订单设置接口
export const deleteOrder=(orderId)=>(
	http.request({
		method:'POST',
		url:`/order/deleteOrder`,
		params:{
			orderId
		}
	})
)