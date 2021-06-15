import Vue from 'vue'
import Vuex from 'vuex'

// 引入模块
import user from './module/user.js'
import shoppingCar from './module/shopping-car.js'

Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		// 身体页面的高度
		windowHeight:0,
		// 没有头部和底部的高度的高度
		setBodyHeight:0,
		// 头部的高度
		setHeaderHeight:0,
		// 身体没有头部的高
		bodyHeight:0,
		// 设置显示
		userToast:false,
		// 设置延时
		clickBoolean:true,
		// 购物车商品
		shoppingCommonData:null
	},
	mutations: {
		// 获取高度
		setWindowHeight(state,value){
			state.windowHeight=value;
			uni.getSystemInfo({
				success:(res)=>{
					state.windowHeight=res.windowHeight+'px'
				}
			})
		},
		// 获取除了头部和底部的高度
		getNoheaderBodyHeight(state,value) {
			state.setBodyHeight = value
		},
		// 获取头部高度
		getHeaderHeight(state,value) {
			state.setHeaderHeight= value
		},
		// 获取除了头部的高度
		getBodyHeight(state,value){
			state.bodyHeight=value
		},
		// 设置显示提示
		showUserToast(state,value){
			state.userToast=value
			// console.log(state.userToast)
		},
		// 设置是否可以点击
		setClickBoolean(state,value){
			state.clickBoolean=value
		},
		// 设置页面选中的商品
		selectCommonData(state,value){
			state.shoppingCommonData=value;
		}
	},
	modules:{
		user,
		shoppingCar
	}
})

export default store
