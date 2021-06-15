import http from '@/utils/http.js'
export const exchange=(obj)=>{
	// console.log('This is qingqiu',obj)
	return http.request({
		url:`/order/createPointOrder`,
		method:'POST',
		data:obj
	})
}