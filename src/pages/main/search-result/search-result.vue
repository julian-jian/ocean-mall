<template>
	<view class="">
		<hxNavbar :back="true" :fixed="true" title="搜索内容" color="#ffffff" />
		<!-- 头部搜索显示栏 -->
		<view class="res-header">
			<view class="header-search">
				<view class="text-box">
					<text class="search-text">{{ searchText }}</text>
				</view>
				<view class="icon-box" @click="goSearchPage">
					<view class="icon-text"><image src="@/static/img/del.png" mode=""></image></view>
				</view>
			</view>
		</view>
		<scroll-view class="search-res" :scroll-y="true" :show-scrollbar="false" :scroll-top="scrollTop" @scrolltolower="onLoadMore" @scroll="scroll" :style="{'max-height':bodyHeight}">
			<!-- 头部搜索显示栏 -->
			<view class="res-header">
				<view class="header-search1"></view>
			</view>
			<!-- 搜索列表显示栏目 -->
			<view class="res-list">
				<view class="content-no-text" v-if="!searchResultList[0]">
					<image src="@/static/img/blank.png" mode="" class="content-blank"></image>
					<view class="content-blank-text">暂无搜索内容</view>
				</view>
				<view class="list-item-box" v-for="(item, key) in searchResultList" :key="key" @click="goCommonDetails(item)">
					<view class="item-image-box"><image class="item-image" :src="item.pic"></image></view>
					<view class="item-title-box">
						<view class="item-title">
							<view class="title">{{ item.name }}</view>
						</view>
						<view class="item-price">
							<view class="price">￥{{ item.price }}</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view :class="{ 'go-top': true, isShowGo: goTopShow }"><image src="@/static/img/gotop.png" mode="" @click="goTop"></image></view>
	</view>
</template>

<script>
import { getClassifyResultList } from '@/api/main/classify.js';
import {mapState} from 'vuex'
export default {
	data() {
		return {
			searchText: '',
			searchResultList: [],
			setPage: {
				//显示的页数
				pageNum: 1,
				pageSize: 12
			},
			scrollTop: 0, //滚动高度
			goTopShow: false, //设置是否显示跳到顶部
			oldScrollTop: 0,
			setScrollTop: false
		};
	},
	methods: {
		// 返回上一页
		goSearchPage() {
			uni.navigateBack({});
		},
		// 获取搜索的内容
		async getClassifyResultList(obj) {
			let data = await getClassifyResultList(obj);
			this.searchResultList = data.data.data.list;
			// console.log(this.searchResultList)
		},
		// 跳转商品详情页面
		goCommonDetails(value) {
			// value.hotType = 1;
			// console.log(value, value.hotType)
			uni.navigateTo({
				url: '/pages/main/commodity-details/commodity-details?data=' + value.id + '&hotType=1'
			});
		},
		// 滚动加载
		async onLoadMore() {
			// 加载更多
			this.setPage.pageNum++;
			let data = await getClassifyResultList({
				keyword: this.searchText,
				...this.setPage
			});
			// console.log(data)
			if (data.data.data.list) {
				data.data.data.list.forEach(item => {
					this.searchResultList.push(item);
				});
			}
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
		}
	},
	computed:{
		...mapState(['bodyHeight'])
	},
	onLoad(obj) {
		// 设置获取参数
		this.searchText = obj.searchText;
		console.log('搜索参数',this.searchText)
		this.getClassifyResultList({
			keyword: this.searchText,
			...this.setPage
		});
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
.search-res {
	width: 750rpx;
	// height: 100vh;
}
// 头部
.res-header {
	width: 750rpx;
}
.header-search {
	height: 70rpx;
	width: 690rpx;
	background-color: red;
	margin: 0 30rpx;
	margin-top: 10rpx;
	background: rgba(255, 255, 255, 1);
	box-shadow: 0rpx 0rpx 9rpx 0rpx rgba(119, 119, 119, 0.3);
	border-radius: 70rpx;
	display: flex;
	justify-content: space-between;
	z-index: 15;
	position: fixed;
	.text-box {
		padding-left: 19rpx;
		.search-text {
			font-size: 30rpx;
			line-height: 70rpx;
			font-weight: 400;
			color: rgba(95, 95, 95, 255);
		}
	}
	.icon-box {
		right: 0;
		height: 54rpx;
		width: 25rpx;
		padding: 0 20rpx;
		position: relative;
		.icon-text {
			position: absolute;
			image {
				padding-top: 25rpx;
				width: 25rpx;
				height: 25rpx;
			}
		}
	}
}
.header-search1 {
	height: 70rpx;
	width: 690rpx;
	margin: 0 30rpx;
	margin-top: 10rpx;
}
// 搜索结果列表
.res-list {
	width: 750rpx;
}
.list-item-box {
	height: 288rpx;
	margin: 0 30rpx;
	display: flex;
	background-color: red;
	background: rgba(255, 255, 255, 1);
	box-shadow: 0rpx 0rpx 38rpx 0rpx rgba(119, 119, 119, 0.19);
	border-radius: 10rpx;
	margin-top: 25rpx;
}
.item-image-box {
	height: 288rpx;
	margin: 0 20rpx;
	.item-image {
		height: 222rpx;
		margin: 33rpx 0;
		width: 222rpx;
	}
}
.item-title-box {
	padding: 30rpx 0;
	position: relative;
	.item-title {
		font-size: 30rpx;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		margin: 20rpx 0;
		padding-right: 30rpx;
		overflow: hidden;
		word-break: break-all;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}
	.item-price {
		position: absolute;
		color: rgba(255, 0, 0, 255);
		bottom: 40rpx;
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
