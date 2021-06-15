<template>
	<view class="box">
		<!-- 设置返回头部 -->
		<view :class="{ 'go-top': true, isShowGo: goTopShow }"><image src="@/static/img/gotop.png" mode="" @click="goTop"></image></view>
		<!-- 头部 -->
		<hxNavbar :fixed="true" :back="true" title="退款 / 售后" color="#FFFFFF"></hxNavbar>
		<scroll-view class="refund" :scroll-y="true" :scroll-top="scrollTop" @scrolltolower="onLoadMore" :style="{'max-height':bodyHeight}" @scroll="scroll">
			<!-- 浮窗弹出 -->
			<tuiModal :show="setModalShow" @click="closeCollerList" radius="0rpx" title="提示" content="是否要删除选择内容"></tuiModal>
			<!-- 身体 -->
			<!--  -->
			<view class="refund-body">
				<!-- 搜索列表显示栏目 -->
				<view class="content-no-text" v-if="!commonDataList[0]">
					<image src="@/static/img/blank.png" mode="" class="content-blank"></image>
					<view class="content-blank-text">暂无售后</view>
				</view>
				<view class="res-list" v-if="commonDataList[0]">
					<view class="box-res" v-for="(item, key) in commonDataList" :key="key">
						<view class="list-item-box">
							<view class="list-icon-top">
								<image src="@/static/img/refund-success.png" mode="" class="icon-top"></image>
								<view class="icon-text">退款</view>
							</view>
							<view class="item-image-box"><image class="item-image" :src="item.productPic"></image></view>
							<view class="item-title-box">
								<view class="item-title">
									<view class="title">{{ item.productName }}</view>
								</view>
								<view class="item-middle">
									<view class="middle">{{ item.productAttr | setSpecification }}</view>
								</view>
								<view class="item-price">
									<view class="price">退款￥{{ item.refoundAmount }}</view>
								</view>
							</view>
						</view>
						<view class="list-item-bottom">
							<view class="bottom-left">
								<text v-if="item.status == 0">待处理</text>
								<text v-if="item.status == 1">退货中</text>
								<text v-if="item.status == 2">退款成功:￥{{ item.refoundAmount * item.productCount }}元</text>
								<text v-if="item.status == 3">已拒绝</text>
							</view>
							<view class="bottom-right">
								<view class="btn sc" @click="showModel(item.id, key)" v-if="item.status == 2">删除记录</view>
								<view class="btn ck" @click="goRefundDetils(item.id, key)">查看详情</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<!-- 弹出提示 -->
		<toast ref="toast"></toast>
	</view>
</template>

<script>
import { getReturnApplyList, delReturnList, getReturnDefault } from '@/api/user/order.js';
import {mapState} from 'vuex'
export default {
	data() {
		return {
			setModalShow: false,
			commonDataList: [],
			setPage: {
				//显示的页数
				pageNum: 1,
				pageSize: 12
			},
			scrollTop: 0, //滚动高度
			oldScrollTop: 0,
			goTopShow: false,
			setScrollTop: false,
			setIndex: 0,
			returnIndex: 0
		};
	},
	methods: {
		// 关闭页面
		async closeCollerList(e) {
			if (e.index == 0) {
				this.setModalShow = false;
			} else if (e.index == 1) {
				// console.log('这是正确的')
				//调用方法
				this.delReturnList(this.setDelId);
			}
		},
		// 显示
		showModel(id, index) {
			this.setModalShow = true;
			this.setDelId = id;
			this.setIndex = index;
		},
		// 获取接口数据
		async getReturnApplyList() {
			let data = await getReturnApplyList(this.setPage);
			this.commonDataList = data.data.data.list;
			// console.log(data)
			// this.commonDataList.forEach(item=>{
			// console.log(item.status)
			// console.log(item.createTime)
			// })
		},
		// 删除申请记录
		async delReturnList(id) {
			let data = await delReturnList(id);
			if (data.data.code == 200) {
				this.setModalShow = false;
				this.commonDataList.splice(this.setIndex, 1);
				setTimeout(() => {
					this.setToastShow({
						title: '删除成功',
						duration: 1000
					});
				}, 200);
			}
		},
		// 页面跳转
		goRefundDetils(item, index) {
			// this.commonData.causeContent=this.causeContent[this.selectCauseIndex]
			// 设置对象，跳转页面返回的参数
			this.returnIndex = index;
			let obj = {
				setID: item,
				backName: 1
			};
			uni.navigateTo({
				url: '/pages/user/refund-details/refund-details?data=' + encodeURIComponent(JSON.stringify(obj))
			});
		},
		// 设置页面下拉加载
		async onLoadMore() {
			this.setPage.pageNum++;
			let data = await getReturnApplyList(this.setPage);
			if (data.data.data.list) {
				data.data.data.list.forEach(item => {
					this.commonDataList.push(item);
				});
			} else {
				let arr = [];
				arr.forEach(item => {
					this.commonDataList.push(item);
				});
			}
			// console.log(data)
		},
		// 滚动设置
		// 滚动设置
		scroll(e) {
			// this.scrollTop=0
			if (this.setScrollTop) {
				this.oldScrollTop = 0;
				this.goTopShow = false;
			} else {
				this.oldScrollTop = e.detail.scrollTop;
				if (e.detail.scrollTop > 500) {
					this.goTopShow = true;
				} else {
					this.goTopShow = false;
				}
				// console.log(e.detail.scrollTop)
			}
		},
		// 跳回顶部
		goTop() {
			this.goTopShow = false;
			this.setScrollTop = true;
			this.scrollTop = this.oldScrollTop;
			this.$nextTick(function() {
				this.oldScrollTop = 0;
				this.scrollTop = 0;
			});
			setTimeout(() => {
				this.setScrollTop = false;
			}, 1000);
		},

		// 设置默认弹窗方法
		setToastShow(params) {
			this.$refs.toast.show({
				...params
			});
		},

		// 设置返回页面的处理
		getSetList() {
			this.getReturnDefault();
		},

		// 获取退货详情
		async getReturnDefault() {
			let data = await getReturnDefault(this.commonDataList[this.returnIndex].id);
			// this.commonData = data.data.data;
			// console.log(this.commonData);
			// console.log(data)
			if (data.data.code == 200) {
				if (data.data.message == '暂无此订单') {
					// console.log(this.returnIndex)
					this.commonDataList.splice(this.returnIndex, 1);
				}
			}
		}
	},
	onLoad() {
		this.getReturnApplyList();
	},
	onShow() {
		// console.log('this is acrived')
		if (this.commonDataList[0]) {
			this.getSetList();
		}
	},
	computed:{
		...mapState(['bodyHeight'])
	},
	filters: {
		setSpecification(value) {
			let str = '';
			let arr = JSON.parse(value);
			if (arr[0]) {
				arr.forEach(item => {
					str = str + `${item.key}:${item.value} `;
				});
				return str;
			} else {
				return '正常';
			}
			// console.log(value)
			// return value
		}
	}
};
</script>

<style lang="scss" scoped>
.refund {
	width: 750rpx;
	// height: 100vh;
	position: relative;
}
.refund-body {
}
.res-list {
	padding: 20rpx 30rpx;
	padding-bottom: 0;
	// transition: all .5s;
	.list-item-box {
		// background-color: red;
		display: flex;
		position: relative;
		border-bottom: 1rpx solid #dde1ea;
		.item-image-box {
			margin: 20rpx 20rpx;
			.item-image {
				width: 146rpx;
				height: 156rpx;
				border-radius: 10rpx;
			}
		}
		.item-title-box {
			width: 60%;
			margin: 20rpx 20rpx;
			margin-left: 0;
			.item-title {
				font-size: 34rpx;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
				line-height: 50rpx;
				overflow: hidden;
				word-break: break-all;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				margin-top: 10rpx;
			}
			.item-middle {
				font-size: 30rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(153, 153, 153, 1);
			}
			.item-price {
				font-family: PingFang SC;
				font-size: 30rpx;
				line-height: 50rpx;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
			}
		}
	}
}
.list-icon-top {
	display: flex;
	width: 105rpx;
	justify-content: space-between;
	position: absolute;
	height: 70rpx;
	right: 20rpx;
	.icon-top {
		width: 40rpx;
		height: 50rpx;
		left: 10rpx;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
	}
	.icon-text {
		font-size: 27rpx;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		position: absolute;
		right: 0;
		top: 45%;
		transform: translateY(-50%);
	}
}

.box-res {
	background: rgba(255, 255, 255, 1);
	box-shadow: 0rpx 0rpx 13rpx 0rpx rgba(119, 119, 119, 0.3);
	border-radius: 20rpx;
	margin-bottom: 30rpx;
}

.list-item-bottom {
	display: flex;
	padding: 20rpx 30rpx;
	height: 60rpx;
	line-height: 60rpx;
	justify-content: space-between;
	.bottom-left {
		font-size: 31rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
	}
	.bottom-right {
		display: flex;
		.btn {
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: rgba(51, 51, 51, 1);
			padding: 0rpx 15rpx;
			height: 55rpx;
			line-height: 55rpx;
			border-radius: 75rpx;
			margin-top: 0rpx;
		}
		.sc {
			color: rgba(153, 153, 153, 1);
			border: 1rpx solid rgba(153, 153, 153, 1);
			margin-right: 20rpx;
		}
		.ck {
			color: rgba(51, 51, 51, 1);
			border: 1rpx solid rgba(51, 51, 51, 1);
		}
	}
}
// 返回头部
// 返回头部
.go-top {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	z-index: 10;
	position: fixed;
	bottom: 100rpx;
	right: 50rpx;
	transform: translateY(200rpx);
	transition: all 0.4s;
	image {
		position: absolute;
		z-index: 100;
		width: 100rpx;
		height: 100rpx;
	}
}
.isShowGo {
	transform: translateY(0rpx);
	transition: all 0.4s;
}

.content-no-text {
	width: 100%;
	// background-color: red;
	.content-blank {
		display: block;
		width: 386rpx;
		height: 320rpx;
		margin: 0 auto;
		margin-top: 113rpx;
	}
	.content-blank-text {
		width: 100%;
		margin: 18rpx 0;
		text-align: center;
		font-size: 35rpx;
		font-weight: 400;
		color: rgba(51, 51, 51, 1);
	}
}
</style>
