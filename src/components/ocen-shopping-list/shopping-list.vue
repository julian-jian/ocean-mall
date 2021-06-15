<template>
	<view class="main-recommend-body">
		<view class="main-recommend-item" v-for="(item, key) in list" :key="key" @click="goCommonDetails(item)">
			<view class="item-image-box"><image :src="item.pic" mode="" class="item-image-image"></image></view>
			<view class="item-title-box">
				<view class="title-header">
					<text class="title-text">{{ item.name }}</text>
				</view>
				<view class="title-history">
					销量{{item.sale}}件
				</view>
				<view class="title-price" v-if="hotType != 2">
					<view class="title-price-text" v-if="item.price">
						<text class="title-icon">￥</text>
						<text class="title-num">{{ item.price.toString().split('.')[0] }}</text>
						<text class="title-decimals">.{{ item.price.toString().split('.')[1] ||'00'}}</text>
						<!-- <text class="title-del" v-if="hotType==1&&item.originalPrice">￥{{item.originalPrice}}</text> -->
					</view>
					<!-- <view class="title-price-icon" v-if="hotType!=1">
						<image src="../../static/img/cart-add-list.png" class="title-price-image" mode=""></image>
					</view> -->
				</view>
				<view class="title-price" v-if="hotType == 2">
					<view class="title-price-text">
						<text class="title-ponint">{{ item.usePointLimit }} 积分</text>
					</view>
					<view class="title-price-conversion"><view class="conversion global-button-Color">兑换</view></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		// 商品列表
		list: {
			default: Array
		},
		hotType:{
			default:Number,
			default:0
		}
	},
	methods: {
		// 跳转商品详情页面
		goCommonDetails(value) {
			if(this.hotType){
				value.hotType=this.hotType;
			}else{
				value.hotType=0;
			}
			// console.log('这是点击',value)
			uni.setStorage({
				key: "share-route-data",
				data: value
			});
			uni.navigateTo({
				// url: '/pages/main/commodity-details/commodity-details?data=' + encodeURIComponent(JSON.stringify(value))
				url: '/pages/main/commodity-details/commodity-details?data=' + value.id + '&hotType=' + value.hotType
			});
		}
	},
	mounted(){
		console.log(this.list)
	}
};
</script>

<style lang="scss" scoped>
// 商品推荐列表
.main-recommend-box {
	width: 750rpx;
	background-color: rgba(255, 255, 255, 1);
	margin-top: 48rpx;
	min-height: 400rpx;
}
.main-recommend-header {
	margin: 0rpx 40rpx;
	display: flex;
	.recommend-header-title {
		margin-right: 43rpx;
		margin-top: 30rpx;
		font-size: 30rpx;
		padding-bottom: 5rpx;
		margin-bottom: 30rpx;
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
	}
	.recommend-header-title.active {
		box-sizing: border-box;
		color: rgba(6, 106, 231, 1);
		border-bottom: 4rpx solid rgba(6, 106, 231, 1);
	}
}
.main-recommend-body {
	margin: 35rpx 30rpx;
	margin-bottom: 0rpx;
	padding-bottom: 160rpx;
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
}
.main-recommend-item {
	width: 332rpx;
	height: 489rpx;
	box-shadow: 0rpx 0rpx 18rpx 0rpx rgba(119, 119, 119, 0.3);
	border-radius: 15rpx;
	overflow: hidden;
	margin-bottom: 28rpx;
	.item-image-box {
		width: 100%;
		height: 286rpx;
		overflow: hidden;
		.item-image-image {
			width: 100%;
			height: 100%;
		}
	}
	.item-title-box {
		height: 173rpx;
		padding: 20rpx 17rpx;
		.title-header {
			height: 72rpx;
			.title-text {
				font-size: 28rpx;
				line-height: 36rpx;
				overflow: hidden;
				word-break: break-all;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
			}
		}
		.title-history{
			color: #9A9A9A;
			font-size: 25rpx;
			padding-top: 10rpx;
		}
		.title-price {
			height: 46rpx;
			position: relative;
		}
		.title-price-icon {
			height: 40rpx;
			width: 40rpx;
			position: absolute;
			top: 70%;
			transform: translateY(-50%);
			right: 5rpx;
			.title-price-image {
				width: 100%;
				height: 100%;
			}
		}
		.title-price-text {
			position: absolute;
			top: 70%;
			transform: translateY(-50%);
			color: red;
			left: -10rpx;
			letter-spacing: 0rpx;
			.title-icon{
				font-size: 28rpx;
			}
			.title-num {
				font-size: 35rpx;
			}
			.title-decimals {
				font-size: 28rpx;
			}
			.title-del{
				font-size: 28rpx;
				padding-left: 10rpx;
				color:rgba(153,153,153,1);
				text-decoration: line-through;
			}
		}
	}
}
.title-ponint {
	font-size: 30rpx;
}
.conversion {
	width: 110rpx;
	height: 45rpx;
	// background: rgba(20, 98, 214, 1);
	border-radius: 23rpx;
	font-size: 26rpx;
	font-family: PingFang SC;
	font-weight: 500;
	color: rgba(255, 255, 255, 0.8);
	line-height: 45rpx;
	text-align: center;
}
.title-price-conversion {
	position: absolute;
	top: 70%;
	transform: translateY(-50%);
	right: 5rpx;
}
</style>
