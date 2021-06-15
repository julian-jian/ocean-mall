<template>
	<view class="reimburse">
		<hxNavbar :fixed="true" :back="true" title="申请售后" color="#FFFFFF"></hxNavbar>
		<view class="item-big-box">
			<view class="item-box" v-for="(item, key) in commonData.orderItemList" :key="key">
				<view class="item-left"><image class="item-image" :src="item.productPic" mode=""></image></view>
				<view class="item-right">
					<view class="title">{{ item.productName }}</view>
					<view class="count">采购数量: {{ item.productQuantity }}</view>
					<view class="money">商品单价: ￥ {{ item.realAmount }}</view>
				</view>
				<view class="item-btn" @click="goRefundPage(item)">退款</view>
			</view>
			<view class="set-bottom">
				<view class="top">
					<view class="head">商品总价</view>
					<view class="last">￥ {{ commonData.totalAmount }}</view>
				</view>
				<view class="top">
					<view class="head">实际付款</view>
					<view class="last">￥ {{ commonData.payAmount }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			commonData: {}
		};
	},
	onLoad(obj) {
		// 加载页面进行赋值
		this.commonData = JSON.parse(decodeURIComponent(obj.data));
		// console.log(this.commonData)
		// 设置page的status的值
		this.commonData.orderItemList.forEach(item=>{
			item.orderStatus=this.commonData.status
		})
	},
	methods: {
		// 跳转退款页面
		goRefundPage(item) {
			uni.navigateTo({
				url: '/pages/user/cancel/cancel?data=' + decodeURIComponent(JSON.stringify(item))
			});
		}
	}
};
</script>

<style lang="scss">
.reimburse {
	width: 750rpx;
}
.item-big-box {
	padding: 30rpx 30rpx;
	padding-bottom: 10rpx;
	box-shadow: 0rpx 0rpx 13rpx 0rpx rgba(119, 119, 119, 0.25);
	.item-box {
		display: flex;
		margin-bottom: 40rpx;
		position: relative;
	}
	.item-left {
		.item-image {
			height: 174rpx;
			width: 174rpx;
		}
	}
	.item-right {
		margin-left: 20rpx;
		.title {
			font-size: 32rpx;
			font-weight: 500;
			color: rgba(51, 51, 51, 1);
			overflow: hidden;
			word-break: break-all;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
		}
		.count {
			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(102, 102, 102, 1);
			padding-top: 30rpx;
		}
		.money {
			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(102, 102, 102, 1);
		}
	}
	.item-btn {
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(102, 102, 102, 1);
		position: absolute;
		bottom: 10rpx;
		right: 0;
		border: 1rpx solid #999999;
		border-radius: 30rpx;
		height: 50rpx;
		line-height: 50rpx;
		width: 120rpx;
		text-align: center;
	}
}
.set-bottom {
	padding-top: 60rpx;
	.top {
		display: flex;
		justify-content: space-between;
		line-height: 90rpx;
		.head {
			font-size: 31rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(51, 51, 51, 1);
		}
		.last {
			font-size: 31rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(51, 51, 51, 1);
		}
	}
}
</style>
