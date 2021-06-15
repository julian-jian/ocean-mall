<script>
import { mapMutations } from 'vuex';
import { refreshToken } from '@/api/main/login.js';
export default {
	methods: {
		...mapMutations('user', ['setLoginToken', 'setLoginstate', 'setUserInfo', 'getBannerList', 'getProductCateList', 'getCategoryTreeList']),
		...mapMutations(['getHeaderHeight', 'getNoheaderBodyHeight', 'getBodyHeight']),
		async init() {
			// 获取banner图
			this.getBannerList();
			// 获取下面图片
			this.getProductCateList();
			// 获取分类图
			this.getCategoryTreeList();

			// 设置登录状态
			const token = uni.getStorageSync('token');
			const hasLogin = uni.getStorageSync('loginState');
			const userInfo = uni.getStorageSync('userInfo');
			// 如果存在就设置
			if (token && hasLogin && userInfo) {
				this.setLoginToken(token), this.setLoginstate(hasLogin);
				this.setUserInfo(userInfo);
			}

			// 设置token
			let data = await refreshToken();
			// console.log(data.data)
			if (data.data.code == 200) {
				let newtoken = data.data.data.token;
				if (newtoken) {
					this.setLoginToken(data.data.data.token), uni.setStorageSync('token', data.data.data.token);
				}
				this.setLoginstate(true);
			} else {
				this.setLoginstate(false);
				this.setUserInfo(null);
			}

			// 设置高度
			const one = uni.getStorageSync('one');
			const two = uni.getStorageSync('two');
			const three = uni.getStorageSync('three');
			if (one && two && three) {
				this.getNoheaderBodyHeight(one);
				this.getHeaderHeight(two);
				this.getBodyHeight(three);
			}
		}
	},
	onLaunch: function() {
		this.init();
		// this.$goLoginPage()
		// this.$utils.goLoginPage()
	},
	onShow: function() {},
	onHide: function() {}
};
</script>

<style lang="scss">
@import 'uni.scss';
@import 'components/ocean-icon/m-icon.css';
/*每个页面公共css */
page {
	min-height: 100%;
	display: flex;
	font-size: 16px;
}

/* #ifdef MP-BAIDU */
page {
	width: 100%;
	height: 100%;
	display: block;
}

swan-template {
	width: 100%;
	min-height: 100%;
	display: flex;
}

/* 原生组件模式下需要注意组件外部样式 */
custom-component {
	width: 100%;
	min-height: 100%;
	display: flex;
}

/* #endif */

/* #ifdef MP-ALIPAY */
page {
	min-height: 100vh;
}

/* #endif */

/* 原生组件模式下需要注意组件外部样式 */
m-input {
	width: 100%;
	/* min-height: 100%; */
	display: flex;
	flex: 1;
}

.content {
	display: flex;
	flex: 1;
	flex-direction: column;
	background-color: #efeff4;
	padding: 10px;
}

.input-group {
	background-color: #ffffff;
	margin-top: 20px;
	position: relative;
}

.input-group::before {
	position: absolute;
	right: 0;
	top: 0;
	left: 0;
	height: 1px;
	content: '';
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
	background-color: #c8c7cc;
}

.input-group::after {
	position: absolute;
	right: 0;
	bottom: 0;
	left: 0;
	height: 1px;
	content: '';
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
	background-color: #c8c7cc;
}

.input-row {
	display: flex;
	flex-direction: row;
	position: relative;
	font-size: 18px;
	line-height: 40px;
}

.input-row .title {
	width: 100px;
	padding-left: 15px;
}

.input-row.border::after {
	position: absolute;
	right: 0;
	bottom: 0;
	left: 8px;
	height: 1px;
	content: '';
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
	background-color: #c8c7cc;
}

.btn-row {
	margin-top: 25px;
	padding: 10px;
}

button.primary {
	background-color: #0faeff;
}

.go-top {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	z-index: 10;
	position: fixed;

	bottom: 100rpx;
	right: 50rpx;
	transform: translateY(180rpx);
	transition: all 0.4s;
	image {
		position: absolute;
		z-index: 100;
		width: 80rpx;
		height: 80rpx;
	}
}
.isShowGo {
	transform: translateY(0rpx);
	transition: all 0.4s;
}
</style>
