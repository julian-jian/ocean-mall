<template>
	<scroll-view class="system-message" id="system-message" :scroll-y="true" :show-scrollbar="false">
		<hxNavbar :fixed="true" :back="true" title="系统信息" color="#FFFFFF">
		</hxNavbar>
		<view class="banner-content">
			<view class="content-item">
				<view class="time">
					<text>2020-07-18 10:00</text>
				</view>
			</view>
			<view class="item-content">
				<text class="title">通知</text>
				<text class="title-content">恭喜你登录成功，获得100积分新人好礼.可随时兑换商品快去购买喜欢的商品吧！</text>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>
<style>
	scroll-view ::-webkit-scrollbar {
		width: 0;
		height: 0;
		background-color: transparent;
	}
</style>
<style lang="scss">
	.system-message {
		width: 750rpx;
		height: 100vh;
		display: fixed;

		.banner-content {
			padding: 41rpx 0;

			.content-item {
				.time {
					margin: auto;
					text-align: center;
					width: 342rpx;
					height: 40rpx;
					background: rgba(203, 204, 199, 0.65);
					border-radius: 5rpx;

					text {
						font-size: 24rpx;
						font-family: PingFang SC;
						font-weight: 500;
						color: rgba(255, 255, 255, 1);
					}
				}
			}

			.item-content {
				width: 630rpx;
				height: 166rpx;
				background: rgba(255, 255, 255, 1);
				box-shadow: 0rpx 0rpx 43rpx 0rpx rgba(119, 119, 119, 0.21);
				border-radius: 10rpx;
				margin: auto;
				margin-top: 18rpx;
				padding: 35rpx 30rpx 0 30rpx;

				text {
					display: block;
				}

				.title {
					font-size: 36rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: rgba(51, 51, 51, 1);
				}

				.title-content {
					padding-top: 17rpx;
					font-size: 24rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: rgba(153, 153, 153, 1);
				}
			}
		}
	}
</style>
