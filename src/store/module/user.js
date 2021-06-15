import {
	getBanner,
	productCateList
} from '@/api/main/main.js';
import {
	categoryTreeList
} from '@/api/main/classify.js';
export default {
	namespaced: true,
	state: {
		token: null,
		hasLogin: false,
		loginCode: null,
		userInfo: {},
		bannerList: [{
			pic: ''
		}],
		mainClassifyList: [],
		classifyList: []
	},
	mutations: {
		// 设置登陆状态
		setLoginstate(state, value) {
			state.hasLogin = value;
		},

		// 设置token
		setLoginToken(state, value) {
			state.token = value
		},
		// 设置登陆code

		setLoginCode(state, value) {
			uni.login({
				success: (res) => {
					state.loginCode = res.code
				}
			})
		},
		// 设置用户信息

		setUserInfo(state, value) {
			state.userInfo = value;
		},

		// 清除所有登陆信息
		cleanLogin(state) {
			state.userInfo = {}
			state.hasLogin = false
			state.loginCode = null
			state.token = null
			uni.removeStorage({
				key: 'token'
			})
			uni.removeStorage({
				key: 'loginState'
			})
			uni.removeStorage({
				key: 'userInfo'
			})
		},

		// 获取bannerList
		async getBannerList(state) {
			// let [err,{fileList}]=await uni.getSavedFileList();
			// let pathArr = []
			// fileList.forEach(item=>{
			// 	pathArr.push(item.filePath)
			// })
			// console.log(pathArr,fileList);
			
			// 获取本地缓存信息
			uni.getStorageInfo({
				success: async (data) => {
					let storageKeys = data.keys;
					// 存放本地缓存url的数组
					let localUrls = [];
					// 请求、添加本地缓存
					let togetBanner = async () => {
						let res = await getBanner();
						let arr = res.data.data.advertiseList;
						state.bannerList = arr;
						uni.setStorage({
							key: 'bannerList',
							data: arr
						})
						// console.log("请求了")
					};
					if (storageKeys.length == 0) {  // 本地无缓存
						await togetBanner();
					} else {  // 本地存在easyimage添加的缓存
						// 获取自己添加的本地缓存
						uni.getStorage({
							key: 'bannerList',
							success: async (data) => {
								let oldbanner = data.data;
								// 遍历自己添加的缓存,与easyimage添加的缓存对比,提取对应的本地缓存url
								await oldbanner.forEach(async (item, index) => {
									if(storageKeys.indexOf(item.pic) !== -1) {
										uni.getStorage({
											key: item.pic,
											success: async (data) => {
												localUrls.push({'pic': data.data});
												// console.log(localUrls);
											}
										})
									}
								})
								// 进入页面先渲染本地缓存
								state.bannerList = localUrls;
								// console.log(state.bannerList);
								// 然后请求获取新数据,并更新自己添加的缓存
								await togetBanner();
							}
						})
					}
				},
				// 获取失败
				fail: async () => {
					await togetBanner();
				}
			})
			// state.bannerList = arr;
		},

		// 获取首页分类图
		async getProductCateList(state) {
			// let [err,{fileList}]=await uni.getSavedFileList();
			// let pathArr = []
			// fileList.forEach(item=>{
			// 	pathArr.push(item.filePath)
			// })

			// let res = await productCateList();
			// let arr = res.data.data;
			
			// 获取本地缓存信息
			uni.getStorageInfo({
				success: async (data) => {
					let storageKeys = data.keys;
					// 存放本地缓存url的数组
					let localProdUrls = [];
					// 请求、添加本地缓存
					let togetMainClassify = async () => {
						let res = await productCateList();
						let arr = res.data.data;
						state.mainClassifyList = arr;
						uni.setStorage({
							key: 'mainClassifyList',
							data: arr
						})
						// console.log("请求了")
					};
					if (storageKeys.length == 0) {  // 本地无缓存
						await togetMainClassify();
					} else {  // 本地存在easyimage添加的缓存
						// 获取自己添加的本地缓存
						uni.getStorage({
							key: 'mainClassifyList',
							success: async (data) => {
								let oldmainClassifyList = data.data;
								// 遍历自己添加的缓存,与easyimage添加的缓存对比,提取对应的本地缓存url
								await oldmainClassifyList.forEach(async (item, index) => {
									if(storageKeys.indexOf(item.icon) !== -1) {
										uni.getStorage({
											key: item.icon,
											success: async (data) => {
												localProdUrls.push({'icon': data.data});
												// console.log(localProdUrls);
											}
										})
									}
								})
								// 进入页面先渲染本地缓存
								state.mainClassifyList = localProdUrls;
								// console.log(state.mainClassifyList);
								// 然后请求获取新数据,并更新自己添加的缓存
								await togetMainClassify();
							}
						})
					}
				},
				fail: async () => {
					await togetMainClassify();
				}
			})
			// state.mainClassifyList = arr;
			// console.log(state.mainClassifyList)
		},

		//获取分类页面图片
		async getCategoryTreeList(state) {
			// let [err,{fileList}]=await uni.getSavedFileList();
			// let pathArr = []
			// fileList.forEach(item=>{
			// 	pathArr.push(item.filePath)
			// })

			let data = await categoryTreeList();
			let arr = data.data.data;
			state.classifyList = arr;
		}
	}
}
