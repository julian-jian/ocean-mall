<template>
	<view id="user">
		<view class="head-message" @click="loginGoPage">
			<image class="center-banner global-Header-Color"  mode=""></image>
			<view class="userImg">
				<image src="../../static/img/main-classify1.png" mode="" v-if="!hasLogin"></image>
				<image :src="userInfo.icon" mode="" v-if="hasLogin"></image>
			</view>
			<view class="registerLogin">
				<view class="login-fail" v-if="!hasLogin">
					<text>注册 / 登录</text>
				</view>
				<view class="login-success"  v-if="hasLogin">
					<text>{{userInfo.nickname}}</text>
					<text>ID: {{userInfo.id}}</text>
				</view>
			</view>
		</view>
		<view class="order-details">
			<view class="order-header" @tap="order">
				<text>我的订单</text>
				<view class="right"><text class="look-all">查看全部</text> <image src="@/static/img/common-selct.png" mode=""></image></image></view>
			</view>
			<view class="order-box">
				<view class="order-item" v-for="(item,key) in orderItem" :key="key" @click="orderitem(key)">
					<image :src="item.img" mode=""></image>
					<text>{{item.text}}</text>
				</view>
			</view>
		</view>
		<view class="instrument">
			<view class="instrument-header">
				<text>我的工具</text>
			</view>
			<view class="instrument-item" @tap="collect">
				<view class="item-image">
					<image src="@/static/img/collect.png" mode=""></image>
				</view>
				<view class="item-text">
					<text>收藏</text>
				</view>
				<view class="item-icon">
					<image src="@/static/img/common-selct.png" mode=""></image>
				</view>
			</view>
			<view class="instrument-item">
				<view class="item-image">
					<image src="@/static/img/service.png" mode=""></image>
				</view>
				<view class="item-text">
					<button open-type="contact">客服</button>
				</view>
				<view class="item-icon">
					<image src="@/static/img/common-selct.png" mode=""></image>
				</view>
			</view>
			<!-- <view class="instrument-item" @click="inform">
				<view class="item-image">
					<image src="@/static/img/inform.png" mode=""></image>
				</view>
				<view class="item-text">
					<text>通知</text>
				</view>
				<view class="item-icon">
					<image src="@/static/img/common-selct.png" mode=""></image>
				</view>
			</view> -->
			<view class="instrument-item" @tap="set">
				<view class="item-image">
					<image src="@/static/img/set.png" mode=""></image>
				</view>
				<view class="item-text noborder">
					<text>设置</text>
				</view>
				<view class="item-icon">
					<image src="../../static/img/common-selct.png" mode=""></image>
				</view>
			</view>
		</view>

		<view class="Mall-entrance" @click="pointShop">
			<view class="text">
				<text class="text-1">积分商城</text>
				<text class="wire"></text>
				<text class="text-2">帮你更省 更优惠</text>
			</view>
			<view class="btn">
				<text class="text-btn">查看更多</text>
			</view>
			<image src="@/static/img/integral.png" mode=""></image>
		</view>
		
		<!-- 弹出提示 -->
		<toast ref="toast"></toast>
		<!-- tabBar -->
		<tab-bar :current="3" selectedColor="#333333" color="#999999"></tab-bar>
	</view>
</template>
<script>
	import {mapState} from "vuex"
	import tabBar from '@/components/tabbar/tabbar.vue'
	export default {
		data() {
			return {
			orderItem:[
				{
					img:"../../static/img/payment.png",
					text:"待付款"
				},{
					img:"../../static/img/stay.png",
					text:"待发货"
				},{
					img:"../../static/img/harvest.png",
					text:"待收货"
				},{
					img:"../../static/img/finish.png",
					text:"已完结"
				},{
					img:"../../static/img/refund-icon.png",
					text:"退款/售后"
				},
			],
			}
		},
		computed:{
			...mapState('user',['hasLogin','userInfo'])
		},
		onLoad(data) {
			// console.log(data)
		},
		watch: {
			// 设置登陆提示
			isShowToast(value){
				console.log('value')
				// if(value){
				// 	this.setToastShow()
				// }
			}
		},
		methods: {
			order() {
				if(this.$utils.currenIsUserpage()){
					return
				}
				uni.navigateTo({
					url: '/pages/user/order/order'
				})
			},
			orderitem(key){
				if(this.$utils.currenIsUserpage()){
					return
				}
				if(key==4){
					uni.navigateTo({
						url:"/pages/user/apply-refund/apply-refund"
					})
				}else{
					uni.navigateTo({
						url:"/pages/user/order/order?key="+Number(key+1)
					})
				}
				
			},
			collect() {
				if(this.$utils.currenIsUserpage()){
					return
				}
				uni.navigateTo({
					url: '/pages/user/collect/collect'
				})
			},
			set(){
				// console.log(this.$utils.currenIsUserpage(),"111");
				if (this.$utils.currenIsUserpage()) {
					return;
				}
				uni.navigateTo({
					url:'/pages/user/set/set'
				})
			},
			loginGoPage(){
				if(!this.hasLogin){
					uni.navigateTo({
						url:"../main/login/login"
					})
				}
			},
			pointShop(){
				if(this.$utils.currenIsUserpage()){
					return
				}
				uni.navigateTo({
					url:"../main/ponint-shop/ponint-shop"
				})
			},
			inform(){
				uni.navigateTo({
					url:"inform/inform"
				})
			},
			// 跳转客服页面
			goService(){
				if(this.$utils.currenIsUserpage()){
					return
				}
			},
			// 设置显示提示
			setToastShow(){
				if(this.userToast){
					console.log('dasdadassdadasd')
					this.$refs.toast.show({
						title: '请登录',
						duration: 1000
					});
					this.$store.commit('showUserToast',false)
				}
			}
		},
		components: {
			tabBar
		}
	}
</script>
<style lang="scss">
	#user {
		width: 750rpx;
		margin: 0 auto;

		// margin-top: 18rpx;
		.title {
			font-size: 36rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(255, 255, 255, 1);
			padding-left: 33rpx;
			text-align: center;
			margin: auto;
		}

		.head-message {
			width: 750rpx;
			height: 136rpx;
			display: flex;
			margin: auto;
			margin-top: 100rpx;

			.center-banner {
				width: 750rpx;
				height: 327rpx;
				position: absolute;
				top: 0;
				z-index: -1;
			}

			.userImg {
				width: 113rpx;
				height: 113rpx;
				// background: rgba(116, 166, 242, 1);
				// border: 4px solid rgba(3, 91, 175, 0.17);
				border-radius: 50%;
				margin-left: 47rpx;

				image {
					width: 100%;
					height: 100%;
					border-radius: 50%;
				}
			}

			.registerLogin {
				flex: 5;
				height: 125rpx;
				line-height: 125rpx;
				margin-left: 19rpx;

				text {
					height: 55rpx;
					line-height: 55rpx;
					margin: 0 10rpx;
					font-size: 36rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: white;
					display: block;
				}
				.login-success{
					text:nth-child(1){
						font-size:42rpx;
						font-family:PingFang SC;
						font-weight:bold;
						color:rgba(255,255,255,1);
					}
					text:nth-child(2){
						font-size:30rpx;
						font-family:PingFang SC;
						font-weight:bold;
						color:rgba(255,255,255,1);
					}
				}
				.login-fail{
					text{
						height: 110rpx;
						line-height: 110rpx;
					}
				}
			}
		}


		.order-details {
			width: 688rpx;
			// height: 213rpx;
			margin: 0 auto;
			margin-bottom: 21rpx;
			box-shadow: 1rpx -6rpx 32rpx 0rpx rgba(119, 119, 119, 0.2);
			border-radius: 10rpx;
			background: white;

			.order-header {
				height: 70rpx;
				line-height: 70rpx;
				display: flex;
				justify-content: space-between;
				padding: 0 20rpx;
				border-bottom: 2rpx solid rgba(153, 153, 153, 0.33);

				text {
					flex: 1;
				}
				
				.right{
					position: relative;
					padding-right: 20rpx;
					height: 70rpx;
					// background-color: red;
					text{
						position: absolute;
						top: 50%;
						transform: translateY(-50%);
						width: 100rpx;
						right: 20rpx;

					}
					image{
							width: 8rpx;
							height: 15rpx;
							position: absolute;
							top: 50%;
							transform: translateY(-50%);
							right: 0;
					}
				}

				text:nth-child(1) {
					font-size: 30rpx;
					font-family: PingFang SC;
					font-weight: bold;
					color: rgba(51, 51, 51, 1);
				}
			}

			.order-box {
				// height: 144rpx;
				display: flex;
				.order-item {
					flex: 1;
					margin: auto;
					text-align: center;
					display: table-cell;
					vertical-align: middle;
					padding-top: 20rpx;
					padding-bottom: 5rpx;
					image {
						// display: block;
						width: 70rpx;
						height: 70rpx;
						// background: linear-gradient(0deg, rgba(30, 165, 255, 1), rgba(140, 208, 244, 1));
					}

					text {
						display: block;
						margin: 20rpx 0;
						font-size: 25rpx;
						font-family: PingFang SC;
						font-weight: 500;
						color: rgba(51, 51, 51, 1);
						margin-top: -5rpx;
						// padding-bottom: 5rpx;
					}
				}
			}
		}

		.instrument {
			width: 689rpx;
			// height: 411rpx;
			margin: 0 auto;
			background: rgba(255, 255, 255, 1);
			box-shadow: 1rpx -6rpx 32rpx 0rpx rgba(119, 119, 119, 0.2);
			border-radius: 10rpx;
			overflow: hidden;

			.instrument-header {
				height: 60rpx;
				line-height: 60rpx;
				font-size: 30rpx;
				padding: 14rpx 19rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: rgba(51, 51, 51, 1);
				border-bottom: 1rpx solid #e3e3e3;
			}

			.instrument-item {
				width: 610rpx;
				height: 90rpx;
				line-height: 90rpx;
				display: flex;
				margin: auto;
				margin-top: 10rpx;
				margin-bottom: 10rpx;
				border-bottom: 1rpx solid #eeeeee;
				.item-image {
					flex: 1;
					height: 90rpx;
					line-height: 90rpx;
					position: relative;
					image {
						position: absolute;
						top: 50%;
						transform: translateY(-50%);
						width: 55rpx;
						height: 55rpx;
					}
				}

				.item-text {
					flex: 16;
					// height: 55rpx;
					line-height: 90rpx;
					margin-left: 10rpx;
					text {
						font-size: 30rpx;
						line-height: 90rpx;
						padding-left: 30rpx;
						font-family: PingFang SC;
						font-weight: 400;
						color: rgba(51, 51, 51, 1);
					}
				}

				.noborder {
					border-bottom: 0;
				}

				.item-icon {
					flex: 1;
					height: 90rpx;
					line-height: 90rpx;
					text-align: center;
					position: relative;
					image {
						width: 12rpx;
						height: 20rpx;
						position: absolute;
						top: 50%;
						transform: translateY(-50%);
					}
				}

			}
			.instrument-item:nth-child(4){
				border-bottom: none;
			}
		}

		.Mall-entrance {
			width: 690rpx;
			height: 274rpx;
			line-height: 274rpx;
			margin: auto;
			margin-top: 47rpx;
			border-radius: 8rpx;
			margin-bottom: 16rpx;
			overflow: hidden;
			// background-image: url(../../static/img/integral.png);
			position: relative;
			image{
				position: absolute;
				width: 100%;
				height: 100%;
				top: 0;
				left: 0;
				z-index: -1;
			}
			.text{
				width: 500rpx;
				height: 60rpx;
				line-height: 60rpx;
				margin: auto;
				padding-top: 39rpx;
			}
			.text-1 {
				margin-left: 22rpx;
				font-size: 48rpx;
				font-family: FZCuHeiSongS-B-GB;
				font-weight: 400;
				color:rgba(255,255,255,1);
			}

			.wire {
				display: inline-block;
				width: 17rpx;
				height: 17rpx;
				border-radius: 50%;
				background: white;
				margin: 0 17rpx;
			}

			.text-2 {
				display: inline-block;
				height: 40rpx;
				line-height: 40rpx;
				font-size: 30rpx;
				font-family: PingFang SC;
				font-weight: 400;
				color:rgba(255,255,255,1);
			}

			.btn {
				margin: auto;
				height: 60rpx;
				line-height: 60rpx;
				text-align: center;
				font-weight: 400;
				margin: 40rpx 16rpx;
				.text-btn{
					display: inline-block;
					width: 108px;
					padding: 0;
				border: 1rpx solid rgba(255, 255, 255, 1);
				color: white;
				font-size: 32rpx;
				font-family: PingFang SC;
				border-radius: 35rpx;
				}
			}
		}

	}
	.item-text{
		button{
			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(51, 51, 51, 1);
			background: rgba(255,255,255,0);
			text-align: left;
			padding: 0;
			padding-left: 30rpx;
			height: 90rpx;
			line-height: 90rpx;
		}
		button::after{
			border: none;
			display: inline-block;
		}
	}
	.look-all{
		color: #999999 !important;
		font-weight: normal !important;
		font-size: 25rpx !important;
	}
</style>
