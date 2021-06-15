<template>
	<view class="sharePopup">
		<!-- 悬浮分享按钮 -->
		<view class="suspension-share" @click="cutPopupState">
			<view class="icon">
				<image class="img" src="/static/img/shareIcon.png" mode=""></image>
			</view>
		</view>
		
		<!-- 分享弹窗 -->
		<view class="Popup-share mask" @click="closePopupBox" @touchmove.stop v-show="isShareBox">
			<view class="Popup-share-box" @click.stop  v-show="isPopupShare">
				<view class="Popup-share-close" @click="closePopupBox">
					X
				</view>
				<view class="Popup-share-title">
					<text>分享智海</text>
				</view>
				<view class="Popup-share-buts">
					
					<button type="default" @click="closePopupBox" class="share-button" open-type="share">
						<image class="img" src="/static/img/WeChaticon.png" mode=""></image>
						<view>微信朋友</view>
					</button>
					<!-- <button type="default" class="share-button" @click="isShareMomentsBox = true"> -->
					<button type="default" class="share-button" @click="preservationImg">
						<image class="img" src="/static/img/MomentsIcon.png" mode=""></image>
						<view>朋友圈</view>
					</button>
				</view>
			</view>
			<view class="share-moments-box" @click.stop v-if="isShareMomentsBox">
				<view class="share-moments-title">
					<text>图片已经保存到相册</text>
				</view>
				<view class="img-box" @touchmove.stop>
					<image @touchmove.stop class="img" :src="imageUrl"></image>
				</view>
				<view class="share-moments-content">
					<text>快去朋友圈分享吧~</text>
				</view>
				<view class="share-moments-but">
					<button class="but-close-moments" type="default" @click="closePopupBox">我知道了</button>
				</view>
			</view>
		</view>
	
	</view>
</template>

<script>
	export default {
		props: {
			imageUrl: {
				type: String,
				default: '/static/img/albumShare.png'
			},
		},
		data() {
			return {
				isShareBox: false,  // 分享弹窗遮罩的状态
				isPopupShare: false,	// 分享弹窗按钮的状态
				isShareMomentsBox: false,   // 分享到朋友圈弹窗的状态
				tabBarPath: ['pages/main/main', 'pages/main/classify/classify', 'pages/shopping-cart/shopping-cart', 'pages/user/user']
			};
		},
		created() {
			// console.log(Boolean(this.detailsImg))
		},
		methods:{
			// 分享弹框弹出
			cutPopupState() {
				const _this = this
				// console.log(getCurrentPages()[getCurrentPages().length - 1].route)
				// 判断是否tabBar页面
				// if(this.tabBarPath.indexOf(getCurrentPages()[getCurrentPages().length - 1].route) !== -1) {
				// 	// console.log('是')
				// 	uni.hideTabBar({
				// 		animation: true,
				// 		success() {
				// 			_this.isShareBox = true;
				// 			_this.isPopupShare = true;
				// 		}
				// 	})
				// } else {
					// console.log('否')
					_this.isShareBox = true;
					_this.isPopupShare = true;
				// }
			},
			// 分享弹框关闭
			closePopupBox() {
				this.isShareBox = false
				this.isPopupShare = false
				this.isShareMomentsBox = false
				// uni.showTabBar({
				// 	animation: true
				// })
			},
			
			// 分享到朋友圈
			preservationImg() {
				const _this = this
				// 是否授权相册
				uni.authorize({
					scope: 'scope.writePhotosAlbum',
					success() {
						// console.log(_this.pattern , _this.detailsImg)
						uni.showLoading({
							title: '图片保存中...',
							mask: true
						})
						// 保存图片
						uni.saveImageToPhotosAlbum({
							filePath: _this.imageUrl,
							success() {
								_this.isShareMomentsBox = true
								uni.hideLoading()
							}
						})
					
					},
					fail() {
						// console.log('失败')
						// 掉起授权
						uni.openSetting({
							success(res) {
								// console.log(res.authSetting)
								// 如果授权成功
								if(res.authSetting['scope.writePhotosAlbum']){
									uni.showLoading({
										title: '图片保存中...',
										mask: true
									})
									uni.saveImageToPhotosAlbum({
										filePath: _this.imageUrl,
										success() {
											_this.isShareMomentsBox = true
											uni.hideLoading()
										},
									})
								}
							},
							fail() {
								// console.log('设置权限失败')
							}
						})
					}
				})
			}
		},
	}
</script>

<style lang="scss">
	.suspension-share {
		width: 60rpx;
		height: 70rpx;
		position: fixed;
		top: 50%;
		right: 0;
		text-align: center;
		font-size: 30rpx;
		line-height: 50rpx;
		background-color: #fff;
		color: #fff;
		box-shadow: 0px 0px 9px 0px rgba(119, 119, 119, 0.3);
		display: flex;
		justify-content: center;
		align-items: center;
		border-top-left-radius: 35rpx;
		border-bottom-left-radius: 35rpx;
		z-index: 99;
		.icon {
			width: 50rpx;
			height: 50rpx;
			.img {
				width: 100%;
				height: 100%;
			}
		}
	}
	
	.mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0,0,0,.3);
		z-index: 9999999999;
		// pointer-events: none;
		.Popup-share-box {
			width: 600rpx;
			border-radius: 20rpx;
			background-image: #ffffff;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			background-color: #ffffff;
			padding: 60rpx 20rpx;
			.Popup-share-close {
				width: 50rpx;
				height: 50rpx;
				color: #333;
				text-align: center;
				line-height: 50rpx;
				position: absolute;
				right: 20rpx;
				top: 10rpx;
				transform: scaleX(1.3);
				z-index: 99;
			}
			.Popup-share-title {
				font-size: 40rpx;
				margin-bottom: 40rpx;
				// font-weight: bold;	
				text-align: center;
			}
			.Popup-share-buts {
				width: 100%;
				display: flex;
				.share-button {
					width: 40%;
					padding: 20rpx;
					font-size: 30rpx;
					background-color: #fff;
					border: 0;
					color: #7D7C7F;
					font-weight: bold;
					line-height: auto;
					.img {
						width: 100rpx;
						height: 100rpx;
					}
				}
				.button-hover {
					background-color: #f1f1f1;
				}
				.share-button::after{ border: none;}
			}
		}
		.share-moments-box {
			width: 600rpx;
			height: auto;
			border-radius: 20rpx;
			background-color: #fff;
			padding: 20rpx;
			display: flex;
			justify-content: center;
			flex-wrap: wrap;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			.share-moments-title {
				margin: 20rpx;
				color: #333;
			}
			.img-box {
				width: 400rpx;
				height: 600rpx;
				.img {
					width: 100%;
					height: 100%;
				}
			}
			.share-moments-content {
				width: 100%;
				text-align: center;
				margin: 20rpx 0;
				color: #333;
			}
			.but-close-moments {
				background-color: #fbfbfb;
				color: #333;
				
			}
		}
	}


</style>
