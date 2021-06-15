@@ -0,0 +1,280 @@
<template>
	<view class="order-detail">
		<hxNavbar :fixed="true" title="订单详情" color="#ffffff" :back="false" leftIcon="arrowleft" @click-left="backPage" />
		<view class="order-success">
			<view class="order-success-page">
				<view class="order-success-text">恭喜订单提交成功！</view>
				<view class="order-success-des">等待卖家发货</view>
				<view class="order-success-icon"><image src="/static/img/true-icon.png" mode="widthFix"></image></view>
			</view>
			<!-- 订单信息列表 -->
			<view class="shopping-card" v-for="(orderItem, orderIndex) in orderList" :key="orderIndex">
				<view class="shopping-category-container">
					<view class="shopping-thuml"><image :src="orderItem.thumlUrl" mode="scaleToFill"></image></view>
					<view class="shopping-info">
						<view class="shopping-title">{{ orderItem.productName }}</view>
						<view class="shopping-price">
							{{ orderMark == 1 ? '积分 ' : '￥' }}
							<text>{{ orderMark == 1 ? orderItem.useIntegration : orderItem.productPrice }}</text>
						</view>
					</view>
					<view class="acount-btns">x{{ orderItem.productQuantity }}</view>
				</view>
			</view>
			<view class="order-info" v-for="(orderInfoListItem, orderInfoListIndex) in orderInfoList" :key="orderInfoListIndex">
				<view class="order-title">订单信息</view>
				<view class="order-number">
					订单编号：
					<text>{{ orderInfoListItem.orderSn }}</text>
				</view>
				<view class="pay-time">
					付款时间：
					<text>{{ orderInfoListItem.createTime }}</text>
				</view>
				<view class="pay-type">
					付款方式：
					<text>{{ orderInfoListItem.payType == 1 ? '微信兑换' : '微信支付' }}</text>
				</view>
			</view>
			<view class="contact-seller">
				<button open-type="contact" class="backKefu"></button>
				<text>联系卖家</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			orderMark: '', //用于判断是积分兑换还是商品购买

			orderList: [], //订单列表
			orderInfoList: [], //订单编号
			orderDetail: '',
			orderDetailAddress: '',
			setBack:true
		};
	},
	onLoad: function(options) {
		// console.log(options)
		// console.log(options.orderType)

		this.orderDetail = JSON.parse(decodeURIComponent(options.orderDetail));
		this.orderDetailAddress = JSON.parse(decodeURIComponent(options.orderDetailAddress));
		this.orderMark = options.payType;
		console.log('订单详情', this.orderDetail);
		console.log('订单信息', this.orderDetailAddress);
		this.orderDetail.forEach((item, index, self) => {
			let orderDetailObj = {};
			orderDetailObj.orderId = item.orderId;
			orderDetailObj.orderSn = item.orderSn; //订单编号
			orderDetailObj.productAttr = item.productAttr; //订单规格
			orderDetailObj.productBrand = item.productBrand;
			orderDetailObj.productCategoryId = item.productCategoryId; //商品类别id
			orderDetailObj.productId = item.productId; //商品id
			orderDetailObj.productName = item.productName;
			orderDetailObj.productPrice = item.productPrice;
			orderDetailObj.thumlUrl = item.productPic;
			orderDetailObj.productQuantity = item.productQuantity;
			orderDetailObj.productSkuCode = item.productSkuCode; //商品码
			orderDetailObj.productSkuId = item.productSkuId; //商品规格id
			orderDetailObj.useIntegration = this.orderDetailAddress.useIntegration; //积分数
			this.orderList.unshift(orderDetailObj);
		});
		this.orderInfoList.unshift(this.orderDetailAddress);
	},
	onUnload() {
		if(this.setBack){
			uni.navigateBack({
				delta:1
			})
		}
	},
	methods: {
		//设置返回事件
		backPage() {
			this.setBack=false;
			uni.navigateBack({
				delta:2
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.order-detail {
	padding-bottom: 87rpx;
}
.order-success {
	width: calc(100vw);
	height: auto;
	padding: 20rpx 28rpx;
	.order-success-page {
		width: 693rpx;
		height: 233rpx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 0px 12px 1px rgba(119, 119, 119, 0.27);
		border-radius: 5px;
		padding-top: 30rpx;
		margin-bottom: 20rpx;
		position: relative;
		.order-success-text {
			width: auto;
			font-size: 35rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: #333333;
			margin-left: 33rpx;
		}
		.order-success-des {
			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: #666666;
			margin: 10rpx 0 0 33rpx;
		}
		.order-success-icon {
			width: 104rpx;
			height: 105rpx;
			opacity: 0.64;
			border-radius: 50%;
			position: absolute;
			top: 50%;
			left: 50%;
			margin-left: -52rpx;
			margin-top: -52rpx;
			& image {
				width: 100%;
				height: 100%;
				display: block;
				border-radius: 50%;
			}
		}
	}
	.shopping-card {
		width: 693rpx;
		// height: 204rpx;
		border-radius: 5rpx;
		margin-bottom: 23rpx;
		box-shadow: 0px 0px 12px 1px rgba(119, 119, 119, 0.27);
		.shopping-category {
			display: flex;
			align-items: center;
			height: 38rpx;
			border-bottom: 1rpx solid #dcdcdc;

			& .shopping-category-text {
				display: inline-block;
				height: 17rpx;
				line-height: 17rpx;
				color: #333333;
				font-size: 30rpx;
				margin-left: 25rpx;
			}
		}
		.shopping-category-container {
			width: auto;
			height: 165rpx;
			display: flex;
			position: relative;
			.category-check {
				display: inline-block;
				width: 17rpx;
				height: 17rpx;
				margin: 0 11rpx;
				border-radius: 50%;
				border: 1rpx solid #1b1b1b;
				position: relative;
				top: 50%;
				margin-top: -8rpx;
				& image {
					width: 100%;
					height: 100%;
					display: block;
				}
			}
			.shopping-thuml {
				width: 113rpx;
				height: 100%;
				position: relative;
				// margin-top: 13rpx;
				margin-right: 28rpx;
				margin-left: 45rpx;
				image {
					width: 113rpx;
					height: 125rpx;
					display: block;
					position: absolute;
					top: 50%;
					transform: translateY(-50%);
				}
			}
			.shopping-info {
				width: 360rpx;
				height: 100%;
				// margin-top: 23rpx;
				.shopping-title {
					width: 358rpx;
					font-size: 30rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: rgba(51, 51, 51, 1);
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					margin-top: 20rpx;
				}
				.shopping-price {
					margin-top: 42rpx;
					color: #fd0101;
					font-size: 30rpx;
				}
			}
			.acount-btns {
				position: absolute;
				right: 20rpx;
				bottom: 20rpx;
				font-size: 30rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(102, 102, 102, 1);
			}
		}
	}
	.order-info {
		width: 668rpx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 0px 12px 1px rgba(119, 119, 119, 0.27);
		border-radius: 5rpx;
		padding-top: 11rpx;
		padding-left: 24rpx;
		.order-title {
			width: auto;
			font-size: 35rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(51, 51, 51, 1);
			padding: 20rpx 0;
		}
		.order-number {
			padding-top: 20rpx;
		}
		.order-number,
		.pay-time,
		.pay-type {
			width: auto;
			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(102, 102, 102, 1);
			padding-bottom: 30rpx;
		}
	}
	.contact-seller {
		width: calc(100vw);
		height: 100rpx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 0px 34px 1px rgba(119, 119, 119, 0.19);
		position: fixed;
		bottom: 0;
		margin-left: -28rpx;
		& text {
			display: inline-block;
			width: 133rpx;
			height: 50rpx;
			border: 1rpx solid rgba(0, 0, 0, 1);
			border-radius: 25rpx;
			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #333333;
			text-align: center;
			line-height: 50rpx;
			position: absolute;
			right: 31rpx;
			top: 50%;
			margin-top: -25rpx;
			padding: 2rpx 15rpx;
		}
		.backKefu {
			display: inline-block;
			width: 133rpx;
			height: 50rpx;
			border-radius: 25rpx;
			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #333333;
			text-align: center;
			line-height: 50rpx;
			position: absolute;
			right: 31rpx;
			top: 50%;
			margin-top: -25rpx;
			padding: 2rpx 15rpx;
			z-index: 555;
		}
		button::after {
			background: rgba(0, 0, 0, 0);
		}
		button {
			background: rgba(0, 0, 0, 0) !important;
		}
	}
}
</style>
