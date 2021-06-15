<template>
	<view class="cancel" id="cancel">
		<hxNavbar :fixed="true" :back="true" title="申请退款" color="#FFFFFF"></hxNavbar>
		<!-- 弹出返回顶部的框 -->
		<view :class="{'go-top':true,'isShowGo':goTopShow}">
			<image src="@/static/img/gotop.png" mode="" @click="goTop"></image>
		</view>
		<view class="top-box">
			<view class="top-content">
				<view class="top-image"><image :src="commonData.productPic" mode=""></image></view>
				<view class="top-text">
					<view class="top-title">{{ commonData.productName }}</view>
					<view class="top-num">采购数量：{{ commonData.productQuantity }}</view>
					<view class="top-price">商品单价：￥{{ commonData.productPrice }}</view>
				</view>
			</view>
		</view>
		<view class="cancel-btn-box">
			<view class="cancel-box">
				<view :class="{ refund: true, 'refund-checked': true }"  v-if="commonData.orderStatus==1">退款</view>
				<view :class="{ refund: true, 'refund-checked': true }"  v-if="commonData.orderStatus==3">退货退款</view>
			</view>
			<!-- 在这里切换 -->
			<view class="refund-details">
				<view class="refund-cause">
					<view class="cause-title">退款原因</view>
					<view class="cause-content">
						<view :class="{ 'cause-item': true, 'cause-item-set': selectCauseIndex == key }" @click="setCauseIndex(key)" v-for="(item, key) in causeContent" :key="key">
							{{ item }}
						</view>
					</view>
				</view>
				<view class="refund-price-1">
					<view class="refund-price-title">联系人名</view>
					<view class="refund-price-num"><input type="text" v-model="person"  placeholder="请输入联系名字"/></view>
				</view>
				<view class="refund-price-1">
					<view class="refund-price-title">联系电话</view>
					<view class="refund-price-num"><input type="number" v-model="phone" placeholder="请输入联系电话"/></view>
				</view>
				<view class="refund-price">
					<view class="refund-price-title">退款金额</view>
					<view class="refund-price-num">￥{{ commonData.realAmount * commonData.productQuantity }}</view>
				</view>
				<view class="title">
					<text class="title-left">申请说明</text>
					<text class="title-right"></text>
				</view>
				<textarea class="textarea" v-model="Statement" />
			</view>
		</view>
		<view class="refund-details"></view>
		<view class="cancel-submit" @click="returnApply">提交申请</view>
		<!-- 弹出提示 -->
		<toast ref="toast"></toast>
	</view>
</template>

<script>
import { returnApply } from '@/api/user/order.js';
export default {
	data() {
		return {
			selectCauseIndex: 0,
			selectRefundIndex: 1,
			causeContent: ['包装不好', '包装不好', '包装不好', '其他'],
			cause: '', //申请原因
			Statement: '' ,//申请说明
			person:'',
			phone:'',
			commonData:{}
		};
	},
	methods: {
		// 页面调转
		goRefundDetils(item) {
			// this.commonData.causeContent=this.causeContent[this.selectCauseIndex]
			let obj = {
				setID:item,
				backName:0
			}
			uni.navigateTo({
				url: '/pages/user/refund-details/refund-details?data=' + encodeURIComponent(JSON.stringify(obj))
			});
		},
		// 开启提示
		// 设置默认弹窗方法
		setToastShow(params) {
			this.$refs.toast.show({
				...params
			});
		},
		// 选择原因
		setCauseIndex(index) {
			this.selectCauseIndex = index;
		},
		// 选择退款类型
		setRefundIndex(key) {
			this.selectRefundIndex = key;
		},
		// 退款
		async returnApply(){
			if(this.person!=''&&this.person!=null){
				if(this.phone!=''&&this.phone.length==11&&parseInt(this.phone).toString().length==11){
					if(this.Statement!=''&&this.Statement!=null){
						let obj = {};
						obj.description=this.Statement;
						obj.orderId=this.commonData.orderId;
						obj.orderSn=this.commonData.orderSn;
						obj.productAttr=this.commonData.productAttr;
						obj.productBrand=this.commonData.productBrand;
						obj.productCount=this.commonData.productQuantity;
						obj.productId=this.commonData.productId;
						obj.productName=this.commonData.productName;
						obj.productPic=this.commonData.productPic;
						obj.productPrice=this.commonData.productPrice;
						obj.productRealPrice=this.commonData.realAmount;
						obj.refoundAmount=this.commonData.realAmount*this.commonData.productQuantity;
						// obj.productRealPrice=commonData.realAmount;
						obj.reason=this.causeContent[this.selectCauseIndex];
						obj.returnName=this.person;
						obj.returnPhone=this.phone;
						obj.returnStatus=this.selectRefundIndex;
						obj.orderItemId = this.commonData.id;
						let data = await returnApply(obj)
						// console.log(data)
						// return
						if(data.data.code==200){
							this.goRefundDetils(data.data.data)
						}
					}else{
						this.setToastShow({
							title: '请输入申请说明',
							duration: 1000
						});
					}
				}else{
					this.setToastShow({
						title: '请输入正确的号码',
						duration: 1000
					});
				}
			}else{
				console.log('ss')
				this.setToastShow({
					title: '请输入正确的姓名',
					duration: 1000
				});
			}
			// console.log(data)
		},
		// 初始化退款类型
		setReturnType(){
			// console.log(this.commonData.orderStatus)
			if(this.commonData.orderStatus==1){
				this.setRefundIndex(1)
			}else if(this.commonData.orderStatus==3){
				this.setRefundIndex(0)
			}
			// console.log(this.selectRefundIndex)
		}
	},
	onLoad(obj) {
		// this.showPopup()
		// console.log(this.popupTitle);
		// 获取数据
		// console.log(JSON.parse(decodeURIComponent(obj.data)));
		this.commonData = JSON.parse(decodeURIComponent(obj.data));
		// console.log(this.commonData)
		this.setReturnType()
	}
};
</script>

<style lang="scss">
.cancel {
	width: 750rpx;
	position: relative;
	.top-box {
		width: 750rpx;
		background: white;
		box-shadow: 2px 8px 21px 0px rgba(119, 119, 119, 0.25);
		.top-content {
			margin: auto;
			padding-top: 20rpx;
			padding-bottom: 20rpx;
			width: 692rpx;
			background: white;
			border-radius: 10rpx;
			display: flex;
			.top-image {
				width: 174rpx;
				height: 174rpx;
				image {
					width: 100%;
					height: 100%;
				}
			}
			.top-text {
				margin-left: 15rpx;
				width: 445rpx;
				.top-title {
					font-size: 32rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: rgba(51, 51, 51, 1);
					overflow: hidden;
					word-break: break-all;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
				}
				.top-num {
					font-size: 28rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: rgba(102, 102, 102, 1);
					padding-top: 10rpx;
				}
				.top-price {
					font-size: 28rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: rgba(102, 102, 102, 1);
				}
			}
		}
	}
	.cancel-btn-box {
		margin: auto;
		margin-top: 24rpx;
		width: 750rpx;
		padding-top: 10rpx;
		background: white;
		box-shadow: 0rpx 0rpx 43rpx 0rpx rgba(119, 119, 119, 0.21);
		.cancel-box {
			width: 692rpx;
			margin: auto;
			display: flex;
			border-radius: 10rpx;
			overflow: hidden;
			margin-top: 10rpx;
			.refund {
				width: 962rpx;
				height: 85rpx;
				line-height: 85rpx;
				text-align: center;
				color: #666666;
				font-size: 36rpx;
				font-weight: bold;
				background: rgba(238, 238, 238, 1);
			}
			.refund-checked {
				color: white;
				background: rgba(0, 0, 0, 0.7);
			}
		}
	}
	.refund-details {
		margin: auto;
		margin-top: 20rpx;
		width: 692rpx;
		// height:255rpx;
		background: white;
		border-radius: 10rpx;
		.refund-cause {
			padding-bottom: 26rpx;
			border-bottom: 1rpx solid rgba(153, 153, 153, 0.2);
			.cause-title {
				font-size: 30rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: rgba(102, 102, 102, 1);
			}
			.cause-content {
				margin-top: 36rpx;
				display: flex;
				justify-content: space-between;
				.cause-item {
					width: 139rpx;
					height: 51rpx;
					line-height: 51rpx;
					text-align: center;
					border: 1rpx solid rgba(153, 153, 153, 1);
					border-radius: 26rpx;
					font-size: 30rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: rgba(102, 102, 102, 1);
					padding: 2rpx 8rpx;
				}
				.cause-item-set {
					color: white;
					background: rgba(51, 51, 51, 0.7);
				}
			}
		}
		.refund-price {
			display: flex;
			justify-content: space-between;
			padding: 15rpx 27rpx;
			height: 50rpx;
			line-height: 50rpx;
			border-bottom: 1rpx solid rgba(153, 153, 153, 0.2);
			.refund-price-title,
			.refund-price-num {
				font-size: 30rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(102, 102, 102, 1);
				line-height: 50rpx;
			}
		}
		.refund-price-1 {
			display: flex;
			padding: 15rpx 27rpx;
			border-bottom: 1rpx solid rgba(153, 153, 153, 0.2);
			.refund-price-title,
			.refund-price-num {
				font-size: 30rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(102, 102, 102, 1);
				line-height: 50rpx;
			}
			input{
				padding-left: 20rpx;
				font-size: 30rpx;
				height: 50rpx;
			}
		}
		.title {
			padding: 20rpx 27rpx;
			display: flex;
			justify-content: space-between;
			.title-left {
				font-size: 30rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(102, 102, 102, 1);
			}
			.title-right {
				font-size: 30rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(102, 102, 102, 1);
			}
		}
		.textarea {
			margin: auto;
			width: 650rpx;
			height: 300rpx;
			padding: 15rpx;
			font-size: 29px;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(51, 51, 51, 1);
			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: 500;
		}
	}
	.cancel-submit {
		width: 750rpx;
		height: 97rpx;
		position: fixed;
		bottom: 0;
		z-index: 100;
		font-size: 48rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		background: rgba(0, 0, 0, 1);
		text-align: center;
		line-height: 97rpx;
	}
}

</style>
