<template>
	<view class="refund" v-if="commonData.id">
		<!-- 弹窗 -->
		<tuiModal :show="modalShow" radius="15rpx" :custom="true" padding="25rpx 25rpx" width="700rpx">
			<view class="modal-box">
				<!-- 物品详情 -->
				<view class="new-message">
					<image :src="commonData.productPic"  mode="" class="message-image"></image>
					<view class="messge-text">
						<view class="message-top">{{commonData.productName}}</view>
						<view class="message-bottom">{{setAttr}}</view>
					</view>
				</view>
				<!-- 物流单号 -->
				<view class="logistics-message">
					<text class="title">物流订单:</text>
					<input type="text" v-model="logisticsNum" class="setinput" placeholder="请填写物流单号" placeholder-style="color:#999;" />
				</view>
				<!-- 寄件人 -->
				<view class="logistics-message">
					<text class="title">寄件人名:</text>
					<input type="text" v-model="person" class="setinput" placeholder="请输入寄件人" placeholder-style="color:#999;" />
				</view>
				<!-- 联系电话 -->
				<view class="logistics-message">
					<text class="title">联系电话:</text>
					<input type="text" v-model="phone" class="setinput" placeholder="请输入寄件人电话" placeholder-style="color:#999;" />
				</view>
				<!-- 按钮 -->
				<view class="btn-message">
					<button type="default" class="btn one" @click="clickModal({ index: 0 })">取消</button>
					<button type="default" class="btn two" @click="clickModal({ index: 1 })">提交</button>
				</view>
				<!-- 弹出提示 -->
				<toast ref="toast"></toast>
			</view>
		</tuiModal>
		<tuiModal :show="modalShow1" @click="closeModel"  title="提示" padding="47rpx 25rpx" content="是否要撤销退款申请，撤销后可重新修改申请"></tuiModal>
		<!-- 头部 -->
		<hxNavbar :fixed="true" :back="false"  leftIcon="arrowleft" title="退款详情" color="#FFFFFF" @click-left="backPage"></hxNavbar>
		<!-- 头部 -->
		<view class="refund-header">
			<view class="refund-header-left">
				<view class="top-title" v-if="commonData.status==0">请等待商家处理</view>
				<view class="top-title" v-if="commonData.status==1">退货中</view>
				<view class="top-title" v-if="commonData.status==2">已完成</view>
				<view class="top-title" v-if="commonData.status==3">已拒绝</view>
				<!-- <view class="last-left">订单会在两小时内关闭</view> -->
			</view>
			<view class="refund-header-right"><image src="@/static/img/funnel.png" mode="" class="right-image"></image></view>
		</view>
		<!-- 申请消息 -->
		<view class="refund-tip">
			<view class="tip-top">您已成功发起退款申请，请耐心等待商家处理。</view>
			<view class="tip-mid">
				<view class="top-mid">
					<view class="radio"></view>
					<text>商家同意，请按照给出的地址退货，并请记录退货运单号。</text>
				</view>
				<view class="top-mid">
					<view class="radio"></view>
					<text>如商家拒绝，您可以修改申请再次发起，商家会重新处理。</text>
				</view>
				<view class="top-mid" v-if="commonData.returnStatus == 0&&commonData.status==1">
					<view class="radio"></view>
					<text>商家地址：{{commonData.companyAddress.province}} {{commonData.companyAddress.city}} {{commonData.companyAddress.detailAddress}}
					商家联系：{{commonData.companyAddress.name}} {{commonData.companyAddress.phone}}</text>
				</view>
			</view>
			<view class="tip-btn-box">
				<button type="default" class="tip-btn red" @click="setModalShow(1)" v-if="commonData.returnStatus == 0&&(commonData.status==0||commonData.status==1)">修改申请</button>
				<button type="default" class="tip-btn" @click="setModalShow(1)" v-if="commonData.returnStatus == 1&&(commonData.status==0||commonData.status==1)">撤销申请</button>
				<button type="default" class="tip-btn" @click="setModalShow(0)" v-if="commonData.returnStatus == 0&&commonData.status==1">我已经寄出</button>
			</view>
		</view>
		<!-- 退款信息 -->
		<view class="refund-new">
			<view class="new-title">退款信息</view>
			<view class="new-message">
				<image :src="commonData.productPic" mode="" class="message-image"></image>
				<view class="messge-text">
					<view class="message-top">{{ commonData.productName }}</view>
					<view class="message-bottom">{{ setAttr }}</view>
				</view>
			</view>
		</view>
		<!-- 条件 -->
		<view class="refund-condition">
			<view class="condition-text">退款原因：{{ commonData.reason }}</view>
			<view class="condition-text">退款金额：￥{{ commonData.refoundAmount }}</view>
			<view class="condition-text">申请时间：{{ commonData.createTime|setData }}</view>
			<view class="condition-text">退款编号：{{ commonData.returnOrderSn }}</view>
		</view>
		<!-- 弹出提示 -->
		<toast ref="toast1"></toast>
	</view>
</template>

<script>
import { getReturnDefault,delReturnApply ,updataReturn} from '@/api/user/order.js';
export default {
	data() {
		return {
			// 设置弹窗显示
			modalShow: false,
			modalShow1: false,
			// 设置input双向绑定
			logisticsNum: '',
			// 设置人员
			person: '',
			// 手机号码
			phone: '',
			// 获取id
			setID: 0,
			// 内容
			commonData: {},
			// 返回的设置
			backName:0,
			setBack:false
		};
	},
	onUnload() {
		if(this.setBack){
			uni.navigateBack({
				delta:2
			})
		}
	},
	methods: {
		// 设置订单设置是否显示
		setModalShow(item) {
			if(item==0){
				this.modalShow = true;
			}else if(item==1){
				this.modalShow1=true;
			}
		},
		
		// 设置modal点击的事件
		async clickModal(e) {
			if (e.index == 1) {
				if(this.logisticsNum!=''&&this.logisticsNum!=null){
					if(this.person!=''&&this.person!=null){
						if(this.phone!=''&&this.phone!=null&&this.phone.length==11){
							// console.log({
							// 	id:this.commonData.id,
							// 	returnMailNumber:this.logisticsNum,
							// 	returnName:this.person,
							// 	returnPhone:this.phone
							// })
							// return
							// 设置信息更新
							let data = await this.updataReturn({
								id:this.commonData.id,
								returnMailNumber:this.logisticsNum,
								returnName:this.person,
								returnPhone:this.phone
							})
							if(data.data.code==200){
								this.modalShow=false;
								setTimeout(()=>{
									this.$refs.toast1.show({
										title: '提交成功',
										duration: 1000
									});
								},300)
							}
						}else{
							this.setToastShow({
								title: '请正确填写手机',
								duration: 1000
							});
						}
					}else{
						this.setToastShow({
							title: '请正确填写姓名',
							duration: 1000
						});
					}
				}else{
					this.setToastShow({
						title: '请正确填写单号',
						duration: 1000
					});
				}
				// this.updataReturn()
				// console.log('This is 信息提交')
			} else if (e.index == 0) {
				// console.log('这是取消');
				this.modalShow = false;
			}
		},
		
		// 设置提示显示
		// 设置默认弹窗方法
		setToastShow(params) {
			// console.log(this.$refs.toast)
			this.$refs.toast.show({
				...params
			});
		},
		
		// 设置返回事件
		backPage(){
			if(this.backName==1){
				uni.navigateBack({
					delta:1
				})
			}else if(this.backName==0){
				this.setBack=false;
				uni.navigateBack({
					delta:3
				})
			}
		},

		// 关闭modal
		async closeModel(e) {
			// console.log(e)
			if (e.index == 0) {
				this.modalShow1 = false;
			} else if (e.index == 1) {
				// console.log(this.commonData.id)
				let data = await delReturnApply(this.commonData.id)
				if(data.data.code==200){
					this.modalShow1=false;
					this.backPage()
				}
				// this.modalShow1 = false;
			}
		},

		// 获取退货详情
		async getReturnDefault() {
			let data = await getReturnDefault(this.setID);
			this.commonData = data.data.data;
			console.log(data);
			// console.log()
		},
		
		// 退款信息更新
		async updataReturn(obj){
			let data = await updataReturn(obj)
			return data
		}
	},
	computed: {
		//设置规格的参数
		setAttr() {
			if (this.commonData.productAttr) {
				let str = '';
				let arr = JSON.parse(this.commonData.productAttr);
				arr.forEach(item => {
					str = str + `${item.key}:${item.value} `;
				});
				return str;
			} else {
				return '正常';
			}
		}
	},
	filters:{
		setData(value){
			if(value){
				return value.slice(0, 10)
			}else{
				return ''
			}
		}
	},
	onLoad(obj) {
		let value = JSON.parse(decodeURIComponent(obj.data));
		this.setID = value.setID;
		this.backName = parseInt(value.backName);
		if(this.backName==0){
			this.setBack=true;
		}
		// console.log(value)
		// console.log
		this.getReturnDefault();
	},
	onShow() {
		this.getReturnDefault();
	}
};
</script>

<style lang="scss" scoped>
.refund {
	width: 750rpx;
	height: 100vh;
}
.refund-header {
	padding: 10rpx 30rpx;
	height: 100rpx;
	display: flex;
	justify-content: space-between;
	box-shadow: 2rpx 9rpx 24rpx 0rpx rgba(119, 119, 119, 0.09);
	// background-color: red;
	.refund-header-left {
		height: 100rpx;
		.top-title {
			font-size: 32rpx;
			font-weight: 500;
			color: rgba(217, 9, 9, 1);
			line-height: 100rpx;
		}
		.last-left {
			font-size: 30rpx;
			font-weight: 500;
			color: rgba(102, 102, 102, 1);
			// line-height: 100rpx;
		}
	}
	.refund-header-right {
		.right-image {
			height: 100rpx;
			width: 140rpx;
			margin-right: 40rpx;
		}
	}
}
.refund-tip {
	padding: 20rpx 30rpx;
	box-shadow: 1rpx 4rpx 24rpx 0rpx rgba(119, 119, 119, 0.09);
	.tip-top {
		font-size: 32rpx;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		padding-top: 20rpx;
	}
}
.tip-mid {
	padding: 30rpx 50rpx;
	padding-bottom: 10rpx;
	.top-mid {
		.radio {
			width: 14rpx;
			height: 14rpx;
			background: rgba(153, 153, 153, 1);
			border-radius: 50%;
			display: inline-block;
			margin: 12rpx 10rpx;
		}
		font-size: 30rpx;
		font-weight: 400;
		color: rgba(51, 51, 51, 0.8);
		display: flex;
		// justify-content: space-between;
		margin-bottom: 20rpx;
		text {
			display: inline-block;
			line-height: 40rpx;
		}
	}
}
.tip-btn-box {
	display: flex;
	flex-direction: row-reverse;
	justify-content: flex-start;
	.tip-btn {
		display: inline-block;
		padding: 0;
		font-size: 32rpx;
		margin: 0;
		font-weight: 400;
		padding: 0 10rpx;
		color: rgba(51, 51, 51, 1);
		background-color: white;
		margin-left: 20rpx;
		border: 1rpx solid rgba(51, 51, 51, 0.3);
		height: 55rpx;
		line-height: 50rpx;
	}
	.red {
		color: #ff0000;
		border: 1rpx solid #ffcece;
	}
}
.refund-new {
	box-shadow: 1rpx 4rpx 24rpx 0rpx rgba(119, 119, 119, 0.09);
	.new-title {
		line-height: 60rpx;
		height: 60rpx;
		padding: 30rpx 30rpx;
		padding-bottom: 10rpx;
	}
	.new-message {
		background: rgba(238, 238, 238, 1);
		padding: 20rpx 30rpx;
		display: flex;
		.message-image {
			height: 160rpx;
			width: 160rpx;
		}
		.messge-text {
			width: 70%;
			padding-left: 20rpx;
			.message-top {
				font-size: 32rpx;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
				line-height: 36rpx;
				overflow: hidden;
				word-break: break-all;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
			}
			.message-bottom {
				font-weight: 400;
				color: rgba(102, 102, 102, 1);
				line-height: 90rpx;
			}
		}
	}
}
.refund-condition {
	font-size: 30rpx;
	font-weight: 400;
	color: rgba(102, 102, 102, 1);
	line-height: 30px;
	padding: 20rpx 40rpx;
}

.modal-box {
	.new-message {
		// background:rgba(238,238,238,1);
		display: flex;
		padding-bottom: 20rpx;
		border-bottom: 1rpx solid #dfdfdf;
		.message-image {
			height: 160rpx;
			width: 160rpx;
		}
		.messge-text {
			width: 70%;
			padding-left: 20rpx;
			.message-top {
				font-size: 30rpx;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
				line-height: 36rpx;
			}
			.message-bottom {
				font-weight: 400;
				font-size: 30rpx;
				color: rgba(102, 102, 102, 1);
				line-height: 90rpx;
			}
		}
	}
	.logistics-message {
		display: flex;
		height: 90rpx;
		line-height: 90rpx;
		font-size: 30rpx;
		transition: none;
		.setinput {
			color: #999999;
			padding-left: 20rpx;
			height: 90rpx;
			line-height: 90rpx;
			font-size: 30rpx;
			// color: #999999;
		}
	}
	.btn-message {
		margin: 0 auto;
		width: 75%;
		display: flex;
		margin-top: 80rpx;
		margin-bottom: 20rpx;
		justify-content: space-between;
		.btn {
			display: inline-block;
			padding: 0;
			height: 76rpx;
			line-height: 76rpx;
			font-size: 35rpx;
			width: 200rpx;
		}
		.one {
			background: rgba(209, 209, 209, 1);
			color: rgba(102, 102, 102, 1);
		}
		.two {
			background: rgba(153, 153, 153, 1);
			color: rgba(51, 51, 51, 1);
		}
	}
}
.modal-box1 {
	.text {
		line-height: 100rpx;
		font-size: 31rpx;
		width: 100%;
		text-align: center;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
	}
	.btn {
		display: flex;
		width: 430rpx;
		justify-content: space-between;
		margin: 0 auto;
		margin-top: 50rpx;
		.btn1 {
			width: 179rpx;
			height: 76rpx;
			border-radius: 5rpx;
			line-height: 76rpx;
			text-align: center;
		}
		.left {
			background: rgba(209, 209, 209, 1);
		}
		.right {
			background: rgba(0, 0, 0, 1);
			color: white;
		}
	}
}
</style>
