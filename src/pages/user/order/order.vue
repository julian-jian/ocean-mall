<template>
	<view class="ocean-box">
		<hxNavbar :fixed="true" :back="false" leftIcon="arrowleft" title="我的订单" color="#FFFFFF" @click-left="backPage"></hxNavbar>
		<!-- 弹出返回顶部的框 -->
		<view :class="{ 'go-top': true, isShowGo: goTopShow }"><image src="@/static/img/gotop.png" mode="" @click="goTop"></image></view>
		<scroll-view id="order" class="order" scroll-y="true" :style="{'height':bodyHeight}" :scroll-top="scrollTop" @scroll="scroll">
			<view scroll-y="true" class="setBodyView">
				<!-- 订单tab -->
				<view class="header">
					<view class="header-item" v-for="(item, key) in state" :key="key" @tap="setselectIndex(key)">
						<text :class="{ 'active-text': key == selectIndex }">{{ item }}</text>
					</view>
				</view>
				<view class="header1"></view>
				<!-- 订单内容 -->
				<view class="order-content-box">
					<view class="order-content">
						<view class="content-no-text" v-if="!list[0]">
							<image src="@/static/img/blank.png" mode="" class="content-blank"></image>
							<view class="content-blank-text">暂无相关订单</view>
						</view>
						<view class="content-item" v-if="list[0]" v-for="(item, key) in list" :key="key" @click="goOrderDefaultPage(item)">
							<view class="state">
								<text v-if="item.status == 0">待付款</text>
								<text v-if="item.status == 1">待发货</text>
								<text v-if="item.status == 2">待收货</text>
								<text v-if="item.status == 3">已完结</text>
								<text v-if="item.status == 4">已取消</text>
							</view>
							<view class="img-content" v-if="item.orderItemList != 0" v-for="(items, keys) in item.orderItemList" :key="keys">
								<view class="img-content-image"><image :src="items.productPic" mode=""></image></view>
								<view class="img-content-content">
									<view class="titleAndNum">
										<text class="title">{{ items.productName }}</text>
										<text class="num">x{{ items.productQuantity }}</text>
									</view>
									<text class="price" v-if="item.payType==1">{{item.useIntegration }} 积分</text>
									<text class="price" v-if="item.payType==2">￥{{ items.productPrice }}</text>
								</view>
							</view>
							<view class="result-price" v-if="item.payType==2">
								<text>总价￥{{ item.payAmount }}</text>
								<text>付款￥{{ item.payAmount }}</text>
							</view>
							<view class="result-price" v-if="item.payType==1">
								<text>总价：{{ item.useIntegration }} 积分</text>
							</view>
							<view class="order-btn" v-if="item.payType==2">
								<!-- affirm1 -->
								<text class="affirm1" v-if="item.status == 2" @click.stop="logistics(item)">物流跟踪</text>
								<text class="affirm1" v-if="item.status == 0" @click.stop="cancels(item)">取消订单</text>
								<!-- affirm2 -->
								<text class="affirm2" v-if="item.status == 0" @click.stop="confirmOrder(item)">去付款</text>
								<text class="affirm2" v-if="item.status == 1" @click.stop="cancel(item)">取消订单</text>
								<text class="affirm2" v-if="item.status == 2" @click.stop="showModal(item)">确认收货</text>
								<text class="affirm2" v-if="item.status == 3" @click.stop="cancel(item)">申请售后</text>
								<text class="affirm2" v-if="item.status == 4" @click.stop="showModelDel(item)">删除订单</text>
							</view>
							<view class="order-btn" v-if="item.payType==1">
								<!-- affirm1 -->
								<text class="affirm1" v-if="item.status == 2" @click.stop="logistics(item)">物流跟踪</text>
								<text class="affirm2" v-if="item.status == 2" @click.stop="showModal(item)">确认收货</text>
							</view>
						</view>
					</view>
				</view>
				<!-- 确认收货弹框 -->
				<tui-modal :show="show" title="提示" content="是否要确认收货" @click="receiptCommon"></tui-modal>
				<!-- 取消订单弹框 -->
				<tui-modal :show="shows" title="提示" content="是否要取消订单" @click="noPayment"></tui-modal>
				<!-- 取消订单弹框 -->
				<tui-modal :show="showss" title="提示" content="是否要删除订单" @click="delOrder"></tui-modal>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import { getOrder, confirmReceiveOrder, cancelUserOrder,deleteOrder } from '@/api/user/order.js';
import { mapState } from 'vuex';
export default {
	data() {
		return {
			selectIndex: 0,
			state: ['全部', '待付款', '待发货', '待收货', '已完结'],
			list: [],
			show: false,
			shows: false,
			showss:false,
			receiptID: null, //确认收货的id
			setCancelId: null,
			delOrderId:null,
			setPage: {
				//显示的页数
				pageNum: 1,
				pageSize: 999
			},
			scrollTop: 0, //滚动高度
			goTopShow: false, //设置是否显示跳到顶部
			oldScrollTop: 0,
			setScrollTop: false
		};
	},
	computed: {
		...mapState(['bodyHeight', 'setHeaderHeight']),
		headerItem0(key) {
			return 'active-text';
		}
	},
	methods: {
		// 下拉刷新
		onPullDownRefresh() {
			// console.log('refresh');
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		async setselectIndex(key) {
			this.selectIndex = key;
			this.setPage.pageNum = 1;
			this.getOrder();
		},
		// 取消订单
		cancel(item) {
			// console.log(item);
			uni.navigateTo({
				// url: '/page/?data='+encodeURIComponent(JSON.stringify(item))
				url: '/pages/user/reimburse/reimburse?data=' + encodeURIComponent(JSON.stringify(item))
			});
		},
		// 跳转物流跟踪
		logistics(item) {
			let obj = {
				id: item.id
			};
			uni.navigateTo({
				url: '/pages/user/logistics/logistics?data=' + encodeURIComponent(JSON.stringify(obj))
			});
		},
		// 代付款的取消订单
		cancels(item) {
			this.setCancelId = item.id;
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
					this.setPage.pageNum=1
					this.getOrder();
				}
			}
		},
		// 跳转订单付款页
		confirmOrder(item) {
			// console.log(encodeURIComponent(JSON.stringify(item)))
			item.moneyType = 3;
			console.log('这是未付款的信息', item);
			// return
			uni.navigateTo({
				url: '../../shopping-cart/confirm-order/confirm-order?noPayment=' + encodeURIComponent(JSON.stringify(item))
			});
		},
		// 设置模块显示
		showModal(item) {
			// console.log(item)
			this.receiptID = item.id;
			this.show = true;
		},
		// 设置页面返回位置
		backPage() {
			// console.log('fan')
			uni.navigateBack({});
		},
		// 确认收货
		async receiptCommon(e) {
			if (e.index == 0) {
				this.show = false;
			} else if (e.index == 1) {
				let data = await confirmReceiveOrder({ orderId: this.receiptID });
				if (data.data.code == 200) {
					this.setPage.pageNum=1;
					this.show = false;
					this.getOrder();
				}
			}
		},
		// 获取列表
		async getOrder() {
			let res = await getOrder({
				status: this.selectIndex - 1,
				...this.setPage
			});
			// console.log(res)
			if (res.data.data.total > 0) {
				this.list = res.data.data.list;
				// console.log(this.list)
			} else {
				this.list = [];
			}
		},
		// 设置返回
		goOrderDefaultPage(item){
			uni.navigateTo({
				url:'/pages/user/order-default/order-default?item='+encodeURIComponent(JSON.stringify(item))
			})
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
		showModelDel(item){
			this.delOrderId=item.id;
			this.showss=true;
			console.log(item)
		},
		// 删除订单
		async delOrder(e){
			if (e.index == 0) {
				this.showss = false;
			} else if (e.index == 1) {
				let data = await deleteOrder(this.delOrderId);
				if (data.data.code == 200) {
					this.showss = false;
					this.getOrder()
				}	
			}
		}
	},
	onLoad(key) {
		// this.order()
		this.selectIndex = key.key || 0;
		this.getOrder();
		// console.log(this.setHeaderHeight)
	},
	onShow() {
		// console.log('Look')
		this.setPage.pageNum=1;
		this.getOrder();
	}
};
</script>
<style></style>
<style lang="scss" scoped>
#order {
	width: 750rpx;
	height: 100vh;

	.setBodyView {
		// position: fixed;
		.header {
			width: 750rpx;
			height: 90rpx;
			line-height: 90rpx;
			display: flex;
			box-shadow: 0px 0px 8px 1px rgba(119, 119, 119, 0.16);

			.header-item {
				flex: 1;
				text-align: center;

				text {
					display: inline-block;
					font-size: 32rpx;
					height: 70rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: rgba(153, 153, 153, 1);
					// border: 1px solid red;
				}
			}
		}

		.active-text {
			border-bottom: 3rpx solid rgba(51, 51, 51, 1);
			color: rgba(51, 51, 51, 1) !important;
		}

		.order-undefult {
			width: 750rpx;
			margin: auto;
			text-align: center;

			image {
				width: 404rpx;
				height: 404rpx;
				background: linear-gradient(-10deg, rgba(17, 119, 249, 0.59), rgba(219, 228, 234, 0.59), rgba(17, 127, 251, 0.59));
				margin-top: 93rpx;
			}

			text {
				display: block;
				font-size: 30rpx;
				font-family: PingFang SC;
				font-weight: 400;
				color: rgba(51, 51, 51, 1);
				// text-align: center;
			}
		}

		.order-content {
			width: 750rpx;

			.content-item {
				margin: 0 auto;
				width: 697rpx;
				// height: 372rpx;
				background: rgba(255, 255, 255, 1);
				box-shadow: 0rpx 0rpx 13rpx 0rpx rgba(119, 119, 119, 0.3);
				border-radius: 20rpx;
				// padding: 15rpx 32rpx 15rpx 19rpx;
				margin: 30rpx 27rpx;

				.state {
					text-align: right;
					font-size: 30rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: rgba(51, 51, 51, 1);
					padding: 15rpx 20rpx 0 0;
				}

				.img-content {
					display: flex;
					padding: 0 19rpx;
					overflow: hidden;
					margin-bottom: 10rpx;
					.img-content-image {
						flex: 1;
						width: 122rpx;
						height: 134rpx;

						image {
							width: 122rpx;
							height: 134rpx;
						}
					}

					.img-content-content {
						flex: 5;
						// padding: 20rpx 15rpx 0;
						padding-left: 20rpx;
						height: 94rpx;

						.titleAndNum {
							// display: block;
							width: 100%;
							// border: 1px solid red;
							display: flex;
							justify-content: space-between;

							.title {
								font-size: 32rpx;
								font-family: PingFang SC;
								font-weight: 500;
								color: rgba(51, 51, 51, 1);
								display: inline-block;
							}

							.num {
								font-size: 32rpx;
								font-family: PingFang SC;
								font-weight: 500;
								display: inline-block;
								color: rgba(51, 51, 51, 1);
								// text-align: right;
							}
						}

						.price {
							display: block;
							font-size: 30rpx;
							font-family: PingFang SC;
							font-weight: 500;
							color: rgba(253, 1, 1, 1);
							margin-top: 45rpx;
						}
					}
				}
			}
		}

		.result-price {
			text-align: right;
			margin: 20rpx 22rpx;

			text {
				display: inline-block;
				font-size: 30rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
			}

			text:nth-child(1) {
				margin-right: 28rpx;
			}
		}

		.order-btn {
			text-align: right;
			padding-bottom: 29rpx;

			text {
				margin-right: 26rpx;
				text-align: center;
				display: inline-block;
				width: 130rpx;
				height: 40rpx;
				border: 1px solid rgba(153, 153, 153, 1);
				border-radius: 35rpx;
				font-size: 30rpx;
				font-family: Adobe Heiti Std;
				font-weight: normal;
				color: rgba(153, 153, 153, 1);
				line-height: 40rpx;
				padding:5rpx 12rpx;
			}

			.affirm2 {
				border: 1rpx solid rgba(51, 51, 51, 1);
				font-size: 30rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: rgba(51, 51, 51, 1);
				line-height: 40rpx;
			}
		}

		.takePopup {
			width: 600rpx;
			height: 300rpx;
			background: white;
			border-radius: 20rpx;

			.ensure-title {
				text-align: center;
				padding: 40rpx;
				font-size: 45rpx;
				font-weight: bold;
				border-bottom: 1px solid rgba(153, 153, 153, 0.47);
			}

			.ensure-btn {
				padding: 40rpx 40rpx 0 40rpx;
				display: flex;
				justify-content: space-around;

				view {
					width: 200rpx;
					height: 100rpx;
					line-height: 100rpx;
					text-align: center;
					// background: skyblue;
					border: 1px solid rgba(153, 153, 153, 0.47);
					border-radius: 10rpx;
					font-size: 40rpx;
				}

				.ensure-ensure {
					background: rgba(14, 90, 187, 1);
					color: white;
				}
			}
		}
	}
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
.setBodyView {
	overflow: hidden;
	position: relative;
}
.header {
	position: fixed;
	background-color: white;
	z-index: 10;
}
.header1 {
	height: 90rpx;
}
.go-top {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	z-index: 10;
	position: fixed;

	/* #ifdef H5 */
	bottom: 140rpx;
	/* #endif */

	/* #ifdef MP-WEIXIN */
	bottom: 100rpx;
	/* #endif */

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
</style>
