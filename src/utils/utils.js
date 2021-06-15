import store from '@/store/index.js'
import {
	paySuccess
} from '@/api/shopping-car/shopping-car.js'

export default {
	// 登陆
	goLoginPage: (url) => {
		if (!store.state.user.hasLogin) {
			// uni.switchTab({
			// 	url: '/pages/user/user'
			// })
			store.commit('showUserToast', true)
			// console.log(store.state.userToast)
			uni.showModal({
				title: "登录提示",
				content: "即将获取您的头像、昵称等信息，是否前往登录？",
				success: (res) => {
					if (res.confirm) {
						// console.log("确认前往登录");
						uni.navigateTo({
							url: url
						})
					}
				}
			})
			return true;
		} else {
			return false;
		}
	},
	currenIsUserpage: () => {
		if (!store.state.user.hasLogin) {
			store.commit('showUserToast', true)
			setTimeout(() => {
				uni.showToast({
					title: '请登录',
					duration: 1000,
					icon: 'none'
				})
			}, 200)
			return true;
		} else {
			return false;
		}
	},
	// 页面支付
	payMent: (res, fun) => {
		let obj = res.data.data.appObject;
		obj.package = obj.app_package;
		delete obj['app_package'];
		uni.showLoading({
			title: '加载中'
		});
		uni.getProvider({
			service: 'payment',
			success: (ress) => {
				// console.log('这是微信支付',res)
				// 判断这是微信支付
				if (ress.provider.indexOf('wxpay') > -1) {
					// console.log('这是支付')
					uni.requestPayment({
						...obj,
						success: async (succes) => {
							let payObj = {};
							payObj.orderId = res.data.data.order.id;
							payObj.payType = res.data.data.order.payType;
							let payData = await paySuccess(payObj)
							// console.log('这是要发送的信息',payObj)
							// console.log('这是付款成功代发货',payData)
							if (payData.data.code == 200 && payData.data.message == '支付成功') {
								console.log('这是支付成功')
								uni.hideLoading();
								fun()
							} else {
								uni.hideLoading();
								uni.showToast({
									title: '付款失败',
									icon: 'none',
									duration: 1000
								})
								// console.log('这是支付失败')
							}
						},
						fail: (err) => {
							uni.hideLoading();
							uni.showToast({
								title: '付款失败',
								icon: 'none',
								duration: 1000
							})
						}
					})
				} else {
					uni.hideLoading();
					uni.showToast({
						title: '不支持微信支付',
						icon: 'none',
						duration: 1000
					})
				}
			},
			fail: (err) => {
				uni.hideLoading();
				uni.showToast({
					title: '无法支付',
					icon: 'none',
					duration: 1000
				})
			}
		})
	},
}
