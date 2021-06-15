<template>
	<view class="order-default">
		<hxNavbar :fixed="true" title="订单详情" color="#ffffff" :back="false" leftIcon="arrowleft" @click-left="backPage" />
		<view class="order-success">
			<view class="order-success-page">
				<view class="order-success-text">
					<text v-if="setCommonData.status == 0">待付款</text>
					<text v-if="setCommonData.status == 1">待发货</text>
					<text v-if="setCommonData.status == 2">已发货</text>
					<text v-if="setCommonData.status == 3">已完成</text>
					<text v-if="setCommonData.status == 4">已取消</text>
				</view>
				<view class="order-success-des">
					<text v-if="setCommonData.status == 0">您的订单等待付款中</text>
					<text v-if="setCommonData.status == 1">您的订单已经下单成功</text>
					<text v-if="setCommonData.status == 2">您的订单已经发货成功</text>
					<text v-if="setCommonData.status == 3">您的订单交易成功</text>
					<text v-if="setCommonData.status == 4">您的订单已经关闭</text>
				</view>
				<view class="order-success-icon"><image src="/static/img/cat-black.png" mode="widthFix"></image></view>
			</view>
			<!-- 个人地址消息 -->
			<view class="reciver">
				<view class="reciver-info">
					<view class="username-phone">
						<view class="reciver-name">{{ setCommonData.receiverName }}</view>
						<view class="reciver-phone-number">{{ setCommonData.receiverPhone }}</view>
					</view>

					<view class="reciver-address">{{ setCommonData.receiverProvince }} {{ setCommonData.receiverRegion }} {{ setCommonData.receiverDetailAddress }}</view>
				</view>
			</view>
			<!-- 订单信息列表 -->
			<view class="shopping-card">
				<view class="shopping-card-box">
					<view class="shopping-category-container" v-for="(item, key) in setCommonData.orderItemList" :key="key">
						<view class="shopping-thuml"><image :src="item.productPic" mode="scaleToFill"></image></view>
						<view class="shopping-info">
							<view class="shopping-title">{{ item.productName }}</view>
							<view class="shopping-price">
								<text>{{ item.realAmount }}</text>
							</view>
						</view>
						<view class="acount-btns">x{{ item.productQuantity }}</view>
					</view>
				</view>
				<view class="shooping-price-total">
					<view class="top">
						<view class="left">商品总价</view>
						<view class="right" v-if="setCommonData.payType==2">￥{{ setCommonData.totalAmount }}</view>
						<view class="right" v-if="setCommonData.payType==1">积分{{ commonData.useIntegration }}</view>
					</view>
					<view class="middle">
						<view class="left">运费</view>
						<view class="right">￥{{freightAmount}}</view>
					</view>
					<view class="bottom">
						<view class="left">实际付款</view>
						<view class="right" v-if="setCommonData.payType==2">￥{{ setCommonData.payAmount }}</view>
						<view class="right" v-if="setCommonData.payType==1">积分{{ commonData.useIntegration }}</view>
					</view>
				</view>
			</view>
			<view class="order-info">
				<view class="order-title">订单信息</view>
				<view class="order-number">
					订单编号：
					<text>{{ setCommonData.orderSn }}</text>
				</view>
				<view class="pay-time">
					付款时间：
					<text>{{ setCommonData.createTime }}</text>
				</view>
				<view class="pay-type" v-if="setCommonData.status == 0">
					付款方式：
					<text>未付款</text>
				</view>
				<view class="pay-type" v-if="setCommonData.payType == 1 && setCommonData.status != 0">
					付款方式：
					<text>积分兑换</text>
				</view>
				<view class="pay-type" v-if="setCommonData.payType == 2 && setCommonData.status != 0">
					付款方式：
					<text>微信支付</text>
				</view>
			</view>
		</view>
		<!-- 设置按钮 -->
		<!-- 确认收货弹框 -->
		<tui-modal :show="show" title="提示" content="是否要确认收货" @click="receiptCommon"></tui-modal>
		<!-- 取消订单弹框 -->
		<tui-modal :show="shows" title="提示" content="是否要取消订单" @click="noPayment"></tui-modal>
		<!-- 取消订单弹框 -->
		<tui-modal :show="showss" title="提示" content="是否要删除订单" @click="delOrder"></tui-modal>
		<!-- 底部 -->
		<view class="contact-seller" v-if="setCommonData.payType == 2">
			<view class="order-btn">
				<!-- affirm1 -->
				<text class="affirm1" v-if="setCommonData.status == 2" @click.stop="logistics()">物流跟踪</text>
				<text class="affirm1" v-if="setCommonData.status == 0" @click.stop="cancels()">取消订单</text>
				<!-- affirm2 -->
				<text class="affirm2" v-if="setCommonData.status == 0" @click.stop="confirmOrder()">去付款</text>
				<text class="affirm2" v-if="setCommonData.status == 1" @click.stop="cancel()">取消订单</text>
				<text class="affirm2" v-if="setCommonData.status == 2" @click.stop="showModal()">确认收货</text>
				<text class="affirm2" v-if="setCommonData.status == 3" @click.stop="cancel()">申请售后</text>
				<text class="affirm2" v-if="setCommonData.status == 4" @click.stop="showModelDel()">删除订单</text>
			</view>
		</view>
		
		<view class="contact-seller"  v-if="setCommonData.payType == 1&&setCommonData.status == 2">
			<view class="order-btn">
				<!-- affirm1 -->
				<text class="affirm1"  @click.stop="logistics()">物流跟踪</text>
				<text class="affirm2"  @click.stop="showModal()">确认收货</text>
			</view>
		</view>
	</view>
</template>

<script>
import { orderDetail,getOrder, confirmReceiveOrder, cancelUserOrder ,deleteOrder} from 'api/user/order.js';
export default {
	data() {
		return {
			commonData: {},
			setCommonData: {},
			show: false,
			shows: false,
			showss:false,
			receiptID: null, //确认收货的id
			setCancelId: null,
			delOrderId:null,
			freightAmount: 0  // 运费
		};
	},
	methods: {
		//设置返回事件
		backPage() {
			uni.navigateBack({});
		},
		async orderDetail() {
			let data = await orderDetail(this.commonData.id);
			console.log('订单信息',this.commonData);
			this.setCommonData = data.data.data;
			console.log('请求数据', data)
			var now = new Date(this.setCommonData.createTime),
				y = now.getFullYear(),
				m = ("0" + (now.getMonth() + 1)).slice(-2),
				d = ("0" + now.getDate()).slice(-2);
			this.setCommonData.createTime = y + "-" + m + "-" + d + " " + now.toTimeString().substr(0, 8);
		},
		// 取消订单
		cancel() {
			// console.log(item);
			uni.navigateTo({
				// url: '/page/?data='+encodeURIComponent(JSON.stringify(item))
				url: '/pages/user/reimburse/reimburse?data=' + encodeURIComponent(JSON.stringify(this.commonData))
			});
		},
		// 跳转物流跟踪
		logistics() {
			let obj = {
				id: this.commonData.id
			};
			uni.navigateTo({
				url: '/pages/user/logistics/logistics?data=' + encodeURIComponent(JSON.stringify(obj))
			});
		},
		// 代付款的取消订单
		cancels() {
			this.setCancelId = this.commonData.id;
			// console.log(item)
			// return
			this.shows = true;
		},
		// 没有支付时候的设置的东西
		async noPayment(e) {
			if (e.index == 0) {
				this.shows = false;
			} else if (e.index == 1) {
				// console.log('This is 确认点击')
				let data = await cancelUserOrder(this.setCancelId);
				if (data.data.code == 200) {
					this.shows = false;
					uni.navigateBack({
					})
				}
			}
		},
		// 跳转订单付款页
		confirmOrder() {
			// console.log(encodeURIComponent(JSON.stringify(item)))
			this.commonData.moneyType = 3;
			console.log('这是未付款的信息', this.commonData);
			// return
			uni.navigateTo({
				url: '../../shopping-cart/confirm-order/confirm-order?noPayment=' + encodeURIComponent(JSON.stringify(this.commonData))
			});
		},
		// 设置模块显示
		showModal() {
			// console.log(item)
			this.receiptID = this.commonData.id;
			this.show = true;
		},
		// 确认收货
		async receiptCommon(e) {
			if (e.index == 0) {
				this.show = false;
			} else if (e.index == 1) {
				let data = await confirmReceiveOrder({ orderId: this.receiptID });
				if (data.data.code == 200) {
					this.show = false;
				}
				uni.navigateBack({
				})
			}
		},
		showModelDel(){
			this.delOrderId=this.commonData.id;
			this.showss=true;
		},
		// 删除订单
		async delOrder(e){
			if (e.index == 0) {
				this.showss = false;
			} else if (e.index == 1) {
				let data = await deleteOrder(this.delOrderId);
				if (data.data.code == 200) {
					this.showss = false;
					uni.navigateBack({
					})
				}	
			}
		}
	},
	onLoad(data) {
		// 设置获取属性
		this.commonData = JSON.parse(decodeURIComponent(data.item));
		this.orderDetail();
		this.freightAmount = this.commonData.freightAmount
	}
};
</script>

<style lang="scss" scoped>
.order-default {
	padding-bottom: 87rpx;
	// height: 100vh;
	width: 100vw;
	// overflow: hidden;
}
.order-success {
	width: calc(100%-60rpx);
	padding: 20rpx 30rpx;
	height: auto;
	.order-success-page {
		width: 693rpx;
		height: 180rpx;
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
			width: 250rpx;
			height: 100%;
			opacity: 0.64;
			border-radius: 50%;
			position: absolute;
			top: 0;
			right: 0;
			image {
				width: 150rpx;
				height: 150rpx;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
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
		padding-top: 10rpx;
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
			height: 150rpx;
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
					margin-top: 32rpx;
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
}

.reciver {
	width: 693rpx;
	height: 150rpx;
	background: rgba(255, 255, 255, 1);
	box-shadow: 0 0 10rpx 1rpx rgba(119, 119, 119, 0.15);
	border-radius: 5rpx;
	display: flex;
	justify-content: space-between;
	// margin: 0 auto;
	margin-top: 15rpx;
	margin-bottom: 12rpx;
	position: relative;
	// border: 1rpx solid #e8e8e8;
	.reciver-info {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		// box-shadow: 0rpx 0rpx 13rpx 0rpx rgba(119, 119, 119, 0.2);
		.username-phone {
			display: flex;
			flex-direction: row;
			.reciver-name,
			.reciver-phone-number {
				margin-left: 24rpx;
				// height:18rpx;
				font-size: 30rpx;
				// line-height: 18rpx;
				font-family: PingFang SC;
				font-weight: 400;
				color: rgba(51, 51, 51, 1);
			}
		}

		.reciver-address {
			margin-left: 20rpx;
			// height:14rpx;
			font-size: 30rpx;
			// line-height: 14rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(51, 51, 51, 1);
		}
	}
	.arrow-right {
		// transform: scale(0.6);
		// margin-top: 20rpx;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		right: 10rpx;
	}
}

.shooping-price-total {
	.top,
	.middle,
	.bottom {
		font-size: 30rpx;
		height: 55rpx;
		line-height: 55rpx;
		width: 100%;
		display: flex;
		color: #999999;
		justify-content: space-between;
		.left {
			padding-left: 30rpx;
		}
		.right {
			padding-right: 30rpx;
		}
	}
	.middle {
		border-bottom: 1rpx solid rgba(0, 0, 0, 0.2);
	}
	.bottom {
		.right {
			color: #fd0101;
		}
	}
}

.contact-seller {
	width: calc(100vw);
	height: 100rpx;
	background: rgba(255, 255, 255, 1);
	box-shadow: 0px 0px 34px 1px rgba(119, 119, 119, 0.19);
	position: fixed;
	bottom: 0;
	.order-btn {
			text-align: right;
			padding: 25rpx;
			text {
				margin-right: 26rpx;
				text-align: center;
				display: inline-block;
				width: 130rpx;
				height: 50rpx;
				border: 1px solid rgba(153, 153, 153, 1);
				border-radius: 35rpx;
				font-size: 30rpx;
				font-family: Adobe Heiti Std;
				font-weight: normal;
				color: rgba(153, 153, 153, 1);
				line-height: 50rpx;
				padding:0rpx 12rpx;
			}

			.affirm2 {
				border: 1rpx solid rgba(51, 51, 51, 1);
				font-size: 30rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: rgba(51, 51, 51, 1);
				line-height: 50rpx;
			}
		}
}
</style>
