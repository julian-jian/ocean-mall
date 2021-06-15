import http from '../../utils/http.js'

// 获取购物车列表数据
export const getShoppingCarList =()=>{
	return http.request({
		url:'/cart/list',
		method:"GET",
	})
}

// 修改商品数量
export const changeShoppingAcount =(obj)=>{
	return http.request({
		url:'/cart/update/quantity',
		method:"GET",
		data:obj
	})
} 
// 删除商品
export const deleteShoppingList =(arr)=>{
	return http.request({
		url:`/cart/delete/?ids=${arr}`,
		method:"POST",
		
	})
}
// 购物车直接下单生成的订单信息
export const addShoppingToConfirmOrder =(arr)=>{
	return http.request({
		url:`/order/generateConfirmOrder`,
		method:"POST",
		data:arr
	})
}

// 购物车生成订单
export const shoppingOrder =(obj)=>{
	return http.request({
		url:`/order/generateOrder`,
		method:"POST",
		data:obj
	})
}
// 用户直接购买生成订单
export const createProductOrder =(obj)=>{
	return http.request({
		url:`/order/createProductOrder`,
		method:"POST",
		data:obj
	})
}

// 付款成功
export const paySuccess =(obj)=>{
	return http.request({
		url:`/order/paySuccess`,
		method:"POST",
		params:obj
	})
}

// 付款成功
export const goToPay =(id)=>{
	return http.request({
		url:`/order/pay/${id}`,
		method:"POST",
		
	})
}