<template>
	<view class="ocean-box">
		<!-- 头部 -->
		<hxNavbar :fixed="true" color="#FFFFFF" :title="itemData.name"/>
		<!-- 身体内容 -->
		<view class="classify-select" :style="{'top':setHeaderHeight}">
			<!-- 头部选择bar栏目 -->
			<view class="classify-select-box" v-for="(item, key) in tabList" :key="key" >
				<text :class="{ 'classify-select-text': true, active: selectIndex == key }" @click="changeSelectIndex(key)">{{ item }}</text>
				<view class="classify-image-box" v-if="key == 2 && selectIndex != key">
					<image src="@/static/img/top-white.png" mode=""></image>
					<image src="@/static/img/down-white.png" mode=""></image>
				</view>
				<view class="classify-image-box" v-if="key == 2 && selectIndex == key">
					<image src="@/static/img/top-white.png" mode="" v-if="isSort"></image>
					<image src="@/static/img/top-black.png" mode="" v-if="!isSort"></image>
					<image src="@/static/img/down-white.png" mode="" v-if="!isSort"></image>
					<image src="@/static/img/down-black.png" mode="" v-if="isSort"></image>
				</view>
			</view>
		</view>
		<scroll-view class="classify-result" :scroll-y="true" :show-scrollbar="false" :scroll-top="scrollTop" @scrolltolower="onLoadMore" @scroll="scroll">
			<!--  -->
			<view class="classify-setBottom"></view>
			<!-- 身体选择部分 -->
			<view class="classify-list"><shoppingList :list="commodityList"></shoppingList></view>
		</scroll-view>
		<!-- 返回按钮 -->
		<view :class="{ 'go-top': true, isShowGo: goTopShow }"><image src="@/static/img/gotop.png" mode="" @click="goTop"></image></view>
		<!-- 悬浮分享按钮 -->
		<share-popup></share-popup>
	</view>
</template>

<script>
import sharePopup from '@/components/sharePopup/sharePopup.vue'
import shoppingList from '@/components/ocen-shopping-list/shopping-list.vue';
import { getClassifyResultList } from '@/api/main/classify.js';
import {mapState} from 'vuex'
export default {
	
	data() {
		return {
			itemData: {},
			setPage: {
				//显示的页数
				pageNum: 1,
				pageSize: 12
			},
			tabList: ['全部', '销量', '价格', '上新'],
			selectIndex: 0,
			commodityList: [],
			isSort: true, //选价格时候的排序方法 true的时候就是从低到高 false就是从高到低a
			sortAction: 0,
			scrollTop: 0, //滚动高度
			goTopShow: false, //设置是否显示跳到顶部
			oldScrollTop: 0,
			setScrollTop: false
		};
	},
	methods: {
		// tab栏目选项
		changeSelectIndex(value) {
			// this.isSort=true;
			this.selectIndex = value;
			this.setPage.pageNum = 1;
			this.getCommodityList();
			this.goTop();
		},
		
		// 获取分类栏目数据
		async getCommodityList() {
			let data = {};
			// 判断三个数据
			// 设置点击第三个的效果
			this.goTop();
			if (this.selectIndex == 2) {
				this.isSort = !this.isSort;
				if (this.isSort) {
					data = await getClassifyResultList({
						productCategoryId: this.itemData.id,
						sort: 3,
						...this.setPage
					});
				} else {
					data = await getClassifyResultList({
						productCategoryId: this.itemData.id,
						sort: 4,
						...this.setPage
					});
				}
			} else {
				this.isSort = true;
				this.selectIndex == 0
					? (data = await getClassifyResultList({
							productCategoryId: this.itemData.id,
							sort: 0,
							...this.setPage
					  }))
					: this.selectIndex == 1
					? (data = await getClassifyResultList({
							productCategoryId: this.itemData.id,
							sort: 2,
							...this.setPage
					  }))
					: this.selectIndex == 3
					? (data = await getClassifyResultList({
							productCategoryId: this.itemData.id,
							sort: 1,
							...this.setPage
					  }))
					: '';
			}

			// 设置
			// console.log(data)
			this.commodityList = data.data.data.list;
		},
		// 滚动获取数据
		async onLoadMore() {
			this.setPage.pageNum++;
			let data = {};
			// 判断三个数据
			// 设置点击第三个的效果
			if (this.selectIndex == 2) {
				// this.isSort = !this.isSort;
				if (this.isSort) {
					data = await getClassifyResultList({
						productCategoryId: this.itemData.id,
						sort: 3,
						...this.setPage
					});
				} else {
					data = await getClassifyResultList({
						productCategoryId: this.itemData.id,
						sort: 4,
						...this.setPage
					});
				}
			} else {
				this.isSort = true;
				this.selectIndex == 0
					? (data = await getClassifyResultList({
							productCategoryId: this.itemData.id,
							sort: 0,
							...this.setPage
					  }))
					: this.selectIndex == 1
					? (data = await getClassifyResultList({
							productCategoryId: this.itemData.id,
							sort: 2,
							...this.setPage
					  }))
					: this.selectIndex == 3
					? (data = await getClassifyResultList({
							productCategoryId: this.itemData.id,
							sort: 1,
							...this.setPage
					  }))
					: '';
			}
			// 设置
			// console.log(data)
			// this.commodityList=data.data.data.list
			let arr = data.data.data.list;
			if (arr) {
				arr.forEach(item => {
					this.commodityList.push(item);
				});
			}
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
	components: {
		shoppingList,
		sharePopup
	},
	computed:{
		...mapState(['setHeaderHeight'])
	},
	onLoad(obj) {
		this.itemData = JSON.parse(decodeURIComponent(obj.value));
		// 输出内容
		// console.log(this.itemData);
		// 调用接口获取数据
		this.getCommodityList();
	},
	// 页面分享
	onShareAppMessage(res) {
		let currentPage = getCurrentPages();
		// console.log(currentPage)
		return {
			path: "/pages/main/classify-result/classify-result?value=" + encodeURIComponent(JSON.stringify(this.itemData)),
			title: this.itemData.name,
			success() {
				
			}
		}
	},
};
</script>

<style>
scroll-view ::-webkit-scrollbar {
	width: 0;
	height: 0;
	background-color: transparent;
}
</style>
<style lang="scss" scoped>
.classify-result {
	width: 750rpx;
	height: 100vh;
	position: fixed;
}
.classify-select {
	padding: 0 30rpx;
	height: 70rpx;
	line-height: 70rpx;
	width: 690rpx;
	z-index: 1;
	background-color: white;
	display: flex;
	justify-content: space-between;
	position: fixed;
	.classify-select-text {
		font-size: 32rpx;
		color: #999999;
	}
	.classify-select-text.active {
		color: #333333;
		border-bottom: 5rpx solid #333333;
	}
}
.classify-setBottom {
	height: 60rpx;
}
.classify-home-text {
	font-size: 30rpx;
	font-weight: 600;
	color: rgba(0, 0, 51, 0.8);
}

// 设置图片
.classify-select-box {
	display: flex;
	justify-content: space-around;
	.classify-image-box {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 25rpx 0;
		padding-bottom: 20rpx;
		padding-left: 10rpx;
		image {
			width: 15rpx;
			height: 9rpx;
		}
	}
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
</style>
