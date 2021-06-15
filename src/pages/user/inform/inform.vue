<template>
	<scroll-view class="inform" id="inform" :scroll-y="true" :show-scrollbar="false">
		<hxNavbar :fixed="true" :back="true" title="信息中心" color="#FFFFFF">
		</hxNavbar>
		<view class="inform-content" @click="systemMessage">
			<view class="inform-system-message">
				<view class="system-img">
					<image src="/static/img/system-message.png" mode=""></image>
				</view>
				<view class="system-text">
					<view class="system-title">
						<text class="system-message">系统通知</text>
						<text class="system-title-content">07月18日</text>
					</view>
					<view class="system-content">
						<text class="content2">购买即送1000积分.还不来购买？</text>
						<text class="number">1</text>
					</view>
				</view>
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
			systemMessage() {
				uni.navigateTo({
					url: "../system-message/system-message"
				})
			}
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
	.inform {
		width: 750rpx;
		height: 100vh;
		display: fixed;

		.inform-content {
			width: 750rpx;
			height: 185rpx;
			background: white;
			display: table-cell;
			vertical-align: middle;
			// background:linear-gradient(0deg,rgba(97,83,247,1) 0%,rgba(135,128,253,1) 94%);
			box-shadow: 0rpx 0rpx 43rpx 0rpx rgba(119, 119, 119, 0.38);

			.inform-system-message {
				display: flex;
				height: 89rpx;
				padding: 0 34rpx;

				.system-img {
					flex: 1;

					image {
						width: 89rpx;
						height: 89rpx;
					}
				}

				.system-text {
					flex: 6;
					margin-left: 26rpx;

					// display: flex;
					.system-title {
						display: flex;
						justify-content: space-between;

						.system-message {
							font-size: 36rpx;
							font-family: PingFang SC;
							font-weight: 500;
							color: rgba(51, 51, 51, 1);
						}

						.system-title-content {
							text-align: right;
							font-size: 30rpx;
							font-family: PingFang SC;
							font-weight: 500;
							color: rgba(102, 102, 102, 1);
						}
					}

					.system-content {
						display: flex;
						justify-content: space-between;
						margin-top: 16rpx;

						.content2 {
							font-size: 24rpx;
							font-family: PingFang SC;
							font-weight: 400;
							color: rgba(102, 102, 102, 1);
						}

						.number {
							text-align: center;
							background: rgba(253, 133, 149, 1);
							width: 29rpx;
							height: 25rpx;
							line-height: 25rpx;
							display: inline-block;
							border-radius: 13rpx;
							font-size: 24rpx;
							font-family: PingFang SC;
							font-weight: 500;
							color: rgba(255, 255, 255, 1);
						}
					}
				}
			}
		}
	}
</style>
