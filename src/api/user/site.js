import http from '../../utils/http.js'

export const getProvinces=(num)=>{
	return http.request({
		url:`/address/provinceList/${num}`,
		method:'GET',
	})
}
