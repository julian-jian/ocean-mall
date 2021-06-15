<template>
	<view class="ocean-box">
		<hxNavbar :back="true" :fixed="true" title="积分商城" color="#ffffff" ref="header" />
		<scroll-view class="ponintShop" :scroll-y="true" :show-scrollbar="false" :scroll-top="scrollTop" @scrolltolower="onLoadMore" @scroll="scroll">
			<!-- banner位置 -->
			<view class="ponintShop-banner">
				<view class="banner-box">
					<view class="banner-title">
						<text class="title-top">我的积分</text>
						<text class="title-middle">{{ point }}</text>
					</view>
					<image src="@/static/img/main-integral.png" class="banner-box-image"></image>
				</view>
			</view>
			<!-- 商品列表详情页面 -->
			<view class="ponintShop-body">
				<view class="ponintShop-body-title"><text>积分兑换</text></view>
				<view class="ponintShop-select" :style="{ top: '0px' }">
					<text v-for="(item, key) in ponintSelect" :key="key" :class="{ action: key == selectIndex, 'select-item': true }" @click="changeSelect(key)">
						{{ item.value }}
					</text>
				</view>
				<view class="ponintShop-body-item" v-if="ponintShopList[0]"><shopping-list :list="ponintShopList" :hotType="2"></shopping-list></view>
				<view class="ponintShop-body-item" v-if="!ponintShopList[0]">
					<view class="content-no-text" v-if="!collectList[0]">
						<image src="@/static/img/blank.png" mode="" class="content-blank"></image>
						<view class="content-blank-text">暂无积分商品</view>
					</view>
				</view>
			</view>
			<view class="main-bottom"></view>
		</scroll-view>
		<view :class="{ 'go-top': true, isShowGo: goTopShow }"><image src="@/static/img/gotop.png" mode="" @click="goTop"></image></view>
		<!-- 悬浮分享按钮 -->
		<share-popup></share-popup>
	</view>
</template>

<script>
import shoppingList from '@/components/ocen-shopping-list/shopping-list.vue';
import sharePopup from '@/components/sharePopup/sharePopup.vue'
import { pointProductList, getPoint } from '@/api/main/main.js';
import { mapState } from 'vuex';
export default {
	data() {
		return {
			// 商品列表数据
			ponintShopList: [],
			setPage: {
				//显示的页数
				pageNum: 1,
				pageSize: 12
			},
			// 兑换数据
			ponintSelect: [
				{ value: '全部', min: 0, max: 0 },
				{ value: '1-1000', min: 1, max: 1000 },
				{ value: '1000-5000', min: 1000, max: 5000 },
				{ value: '5000-10000', min: 5000, max: 10000 },
				{ value: '10000以上', min: 10000, max: 9999999 }
			],
			selectIndex: 0,
			point: 0, //个人积分
			scrollTop: 0, //滚动高度
			goTopShow: false, //设置是否显示跳到顶部
			oldScrollTop: 0,
			setScrollTop: false
		};
	},
	methods: {
		// 更改index的值
		changeSelect(key) {
			this.selectIndex = key;
			this.setPage.pageNum = 1;
			this.pointProductList();
		},
		// 获取积分分类的数据
		async pointProductList() {
			let data = await pointProductList({ ...this.ponintSelect[this.selectIndex], ...this.setPage });
			this.ponintShopList = data.data.data;
			// console.log(this.ponintShopList)
		},
		// 获取积分数据
		async getPoint() {
			let data = await getPoint();
			this.point = data.data.data;
			console.log(data);
		},
		// 动态加载下一页
		async onLoadMore() {
			this.setPage.pageNum++;
			let data = await pointProductList({ ...this.ponintSelect[this.selectIndex], ...this.setPage });
			data.data.data.forEach(item => {
				this.ponintShopList.push(item);
			});
		},

		// 设置按钮
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
		}
	},
	onLoad() {
		this.pointProductList();
		this.getPoint();
	},
	onShow() {
		this.getPoint();
	},
	components: {
		shoppingList,
		sharePopup
	},
	computed: {
		...mapState(['setHeaderHeight'])
	},
	onShareAppMessage(res) {
		// console.log(res)
		return {	
			title: '智海海洋'
		}
	}
};
</script>

<style>
/* scroll-view ::-webkit-scrollbar {
	width: 0;
	height: 0;
	background-color: transparent;
} */
</style>
<style lang="scss" scoped>
.ponintShop {
	width: 750rpx;
	height: 100vh;
	position: fixed;
}
// 头部
.ponintShop-header {
	width: 100%;
	height: 100%;
	position: relative;
	.ponintShop-header-text {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
		font-size: 36rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
	}
}
// banner位置
.ponintShop-banner {
	width: 750rpx;
	.banner-box {
		height: 330rpx;
		border-radius: 10rpx;
		margin: 0 30rpx;
		margin-top: 10rpx;
		margin-bottom: 50rpx;
		overflow: hidden;
		position: relative;
		.banner-box-image {
			width: 100%;
			height: 100%;
		}
		.banner-title {
			margin: 40rpx 30rpx;
			position: absolute;
			z-index: 10;
		}
		.title-top {
			font-size: 36rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(255, 255, 255, 0.9);
			display: block;
		}
		.title-middle {
			font-size: 72rpx;
			font-family: Arial;
			font-weight: bold;
			color: rgba(255, 255, 255, 1);
			display: block;
			margin-top: 20rpx;
			margin-bottom: 55rpx;
		}
		.title-bottom {
			font-size: 32rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(255, 255, 255, 0.8);
			display: block;
		}
	}
}
// 商品选择列表
.ponintShop-select {
	padding: 10rpx 30rpx;
	padding-top: 20rpx;
	font-size: 22rpx;
	background-color: white;
	display: flex;
	justify-content: space-between;
	position: sticky;
	z-index: 10;
	.select-item {
		border: 1px solid rgba(181, 181, 181, 1);
		color: rgba(84, 84, 84, 255);
		border-radius: 27px;
		padding: 10rpx 18rpx;
	}
	.select-item.action {
		color: rgba(0, 0, 0, 1);
		border-color: rgba(0, 0, 0, 1);
	}
}
.ponintShop-body {
	position: relative;
}
//商品列表
.ponintShop-body-title {
	margin-left: 30rpx;
	font-size: 32rpx;
	font-family: PingFang SC;
	font-weight: 500;
	color: rgba(51, 51, 51, 1);
}
.main-bottom {
	height: 120rpx;
	background-color: white;
}

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
