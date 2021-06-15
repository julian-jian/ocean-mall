<template>
	<view id="set" class="set">
		<hxNavbar :back="true" title="个人信息" color="#FFFFFF">
		</hxNavbar>
		<view class="logo">
			<text>头像</text>
			<view class="image">
				<image src="@/static/img/main-classify1.png" mode="" v-if="!userInfo.nickname"></image>
				<image :src="userInfo.icon" mode="" v-if="userInfo.nickname"></image>
			</view>
		</view>
		<view class="content">
			<view class="nickname">
				<view class="content-item">
					<text>昵称</text>
					<text>{{userInfo.nickname}}</text>
				</view>
			</view>
			<view class="userid">
				<view class="content-item">
					<text>用户ID</text>
					<text>{{userInfo.id}}</text>
				</view>
			</view>
			<view class="gain" @click="site">
				<view class="content-item" style="position: relative;">
					<text>收货地址</text>
					<image src="@/static/img/common-selct.png" mode="" class="setImage"></image>
				</view>
			</view>
		</view>
		<view class="out-login">
			<view class="out-btn">
				<button type="default" @click="checkoutLogin">退出登录</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import {
		getPeopleInfo
	} from '../../../api/user/user.js'
	export default {
		data() {
			return {
				userInfo: {}
			}
		},
		computed: {
			...mapState('user', ['hasLogin', 'token'])
		},
		methods: {
			...mapMutations('user', ['cleanLogin']),
			site() {
				uni.navigateTo({
					url: "../site/site?type="+'true'
				})
			},
			checkoutLogin() {
				this.cleanLogin()
				uni.showLoading({
					mask: true,
					title: "退出登录中...",
					success(res) {
						setTimeout(() => {
							uni.navigateBack({})
						}, 1000)
					},
					fail(err) {
						console.log(err);
					}
				})
			},
			onPullDownRefresh() {
				console.log('refresh');
				setTimeout(function() {
					uni.stopPullDownRefresh();
				}, 1000);
			},
			// 获取个人信息
			async getPeopleInfo() {
				let data = await getPeopleInfo()
				// 设置用户信息
				if (data.data.data) {
					this.userInfo = data.data.data;
					console.log('设置了', this.userInfo)
				}
			},
		},
		onShow() {
			if (this.hasLogin && !this.userInfo.nickName) {
				console.log(!this.userInfo.nickName)
				console.log(this.userInfo.nickName)
				this.getPeopleInfo()
			}
		},
	}
</script>

<style lang="scss">
	.set {
		width: 750rpx;

		.title {
			display: block;
			text-align: center;
		}

		.logo {
			width: 750rpx;
			height: 103rpx;
			line-height: 103rpx;
			background: white;
			box-shadow: 0px 0px 18rpx 0px rgba(119, 119, 119, 0.39);
			display: flex;
			margin-bottom: 20rpx;
			justify-content: space-between;
			text:nth-child(1) {
				font-size: 32rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
				margin-left: 37rpx;
			}

			.image {
				display: inline-block;
				margin-top: 16rpx;
				text-align: right;
				image {
					width: 69rpx;
					height: 69rpx;
					line-height: 69rpx;
					border-radius: 50%;
					display: table-cell;
					vertical-align: middle;
				}
				margin-right: 30rpx;
			}
		}

		.content {
			// height: 242rpx;
			box-shadow: 0px 0px 18rpx 0px rgba(119, 119, 119, 0.39);
			padding: 0;


			.nickname,
			.gain,
			.userid {
				width: 750rpx;
				background: white;

				.content-item {
					display: flex;
					width: 681rpx;
					margin: auto;
					height: 100rpx;
					line-height: 100rpx;
					border-bottom: 1rpx solid rgba(153, 153, 153, 0.2);

					text:nth-child(1) {
						font-size: 32rpx;
						font-family: PingFang SC;
						font-weight: 500;
						color: rgba(51, 51, 51, 1);
						width: 70vh;
					}

					text:nth-child(2) {
						width: 30vh;
						text-align: right;
					}
				}
			}

			.gain {
				.content-item {
					border-bottom: 0;
				}
			}
		}

		.out-login {
			// display: table-cell;
			// vertical-align: middle;
			margin-top: 341rpx;

			.out-btn {
				width: 750rpx;
				height: 94rpx;

				button {
					height: 94rpx;
					line-height: 94rpx;
					width: 568rpx;
					background: rgba(39,39,39,1);
					border-radius: 10rpx;
					font-size: 32rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: rgba(255, 255, 255, 1);
				}
			}
		}
	}
	.setImage{
		width: 10rpx;
		height: 20rpx;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		right: 8rpx;
	}
</style>
