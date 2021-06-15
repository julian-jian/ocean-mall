<template>
	<view :style="{ height: windowHeight }" class="main">
		<view class="search-to-view" @click="goSearchPage">
			<hxNavbar :back="false" :fixed="true" ref="header">
				<view slot="left">
					<view class="main-header-icon"><image src="@/static/img/logo-icon.png" mode=""></image></view>
				</view>
				<view class="main-header-search-box">
					<view class="main-header-search">
						<view class="main-header-search-input">
							<image class="main-header-search-icon" src="@/static/img/main-search@1x.png" mode=""></image>
							<text class="main-header-search-text">搜索商品</text>
						</view>
					</view>
				</view>
			</hxNavbar>
		</view>
		<!-- 弹出返回顶部的框 -->
		<view :class="{ 'go-top': true, isShowGo: goTopShow }"><image src="@/static/img/gotop.png" mode="" @click="goTop"></image></view>
		<!-- 滚动盒子 -->
		<scroll-view class="main" :scroll-y="true" :style="{ height: setBodyHeight }" :scroll-top="scrollTop" @scrolltolower="onLoadMore" @scroll="scroll">
			<!-- banner位置 -->
			<view class="main-banner">
				<view class="main-swiper-box">
					<view class="main-swiper">
						<swiper
							:indicator-dots="true"
							:autoplay="bannerAutoPlay"
							:interval="3000"
							duration="100"
							indicator-active-color="rgba(255, 255, 255, 1)"
							indicator-color="rgba(153, 153, 153, 1)"
							class="swiper"
							:circular="true"
							@change="changeSwiper"
							v-if="bannerList"
						>
							<swiper-item class="swiper-item-box" v-for="(item, key) in bannerList" :key="key" @click="handleFullImage(item)" :item-id="item.pic">
								<view class="swiper-item">
									<easyimage :image-src="item.pic" mode="" class="swiper-item-image" v-if="item.pic.indexOf('mp4') == -1"></easyimage>
									<video :src="item.pic" v-if="item.pic.indexOf('mp4') > -1" object-fit="fill" :autoplay="true" :loop="true" id="swiper-video"></video>
								</view>
							</swiper-item>
						</swiper>
					</view>
				</view>
				<!-- {{ Math.ceil(mainClassifyList.length / 10) }} -->
				<swiper :indicator-dots="true" :autoplay="false" :interval="3000" :duration="1000" class="category-swiper">
					<swiper-item v-for="(swiper_item, swiper_idx) in 1" :key="swiper_idx">
						<view class="main-classify-box">
							<view class="main-classify">
								<view
									class="main-classify-item"
									v-for="(item, key) in mainClassifyList"
									:key="key"
									@click="goClassifyResultPage(item)"
									:class="{
										hidden: key < swiper_idx * 10 || key >= (swiper_idx + 1) * 10
									}"
								>
									<view class="main-classify-icon-box"><easyimage :image-src="item.icon" mode="" class="main-classify-icon"></easyimage></view>
									<view
										class="main-classify-title"
										:class="{
											'set-main-classify-title': mainClassifyList.length - key <= 5
										}"
									>
										<text>{{ item.name }}</text>
									</view>
								</view>
							</view>
						</view>
					</swiper-item>
				</swiper>
				<!-- 走马灯 -->
				<view class="main-text-roll"><uni-notice-bar v-if="setRemindList" :scrollable="true" :single="true" showIcon="true" :text="setRemindList"></uni-notice-bar></view>
			</view>
			<!-- 积分商城跳转页面 -->
			<!-- <view class="main-integral-box">
				<view class="main-integral" @click="goPonintPage">
					<view class="main-integral-text">
						<view class="integral-first-title"><text>一键直通积分商城</text></view>
						<view class="integral-last-title">
							<text class="last-top">积分兑换不停</text>
							<text class="last-bottom">低价购买商品</text>
						</view>
					</view>
					<image src="@/static/img/main-integral-bg@2x.png" mode="" class="main-integral-image"></image>
				</view>
			</view> -->
			<view class="integral-main">
				<view class="left">
					<view @click="navTo('../ranking/amount')">
						<text>天梯榜</text>
						<view v-if="ranking_amount.length">
							<view>
								<image src="../../static/img/ranking-2.jpeg" mode="widthFix"></image>
								<image :src="ranking_amount[1].userIcon" mode="aspectFill"></image>
								<text>{{ ranking_amount[1].nickname }}</text>
							</view>
							<view>
								<image src="../../static/img/ranking-1.jpeg" mode="widthFix"></image>
								<image :src="ranking_amount[0].userIcon" mode="aspectFill"></image>
								<text>{{ ranking_amount[0].nickname }}</text>
							</view>
							<view>
								<image src="../../static/img/ranking-3.jpeg" mode="widthFix"></image>
								<image :src="ranking_amount[2].userIcon" mode="aspectFill"></image>
								<text>{{ ranking_amount[2].nickname }}</text>
							</view>
						</view>
					</view>
					<view @click="navTo('../ranking/integral')">
						<text>积分榜</text>
						<view v-if="ranking_integral.length">
							<view>
								<image src="../../static/img/ranking-2.jpeg" mode="widthFix"></image>
								<image :src="ranking_integral[1].userIcon" mode="aspectFill"></image>
								<text>{{ ranking_integral[1].nickname }}</text>
							</view>
							<view>
								<image src="../../static/img/ranking-1.jpeg" mode="widthFix"></image>
								<image :src="ranking_integral[0].userIcon" mode="aspectFill"></image>
								<text>{{ ranking_integral[0].nickname }}</text>
							</view>
							<view>
								<image src="../../static/img/ranking-3.jpeg" mode="widthFix"></image>
								<image :src="ranking_integral[2].userIcon" mode="aspectFill"></image>
								<text>{{ ranking_integral[2].nickname }}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="right" @click="goPonintPage">
					<text>积分商场</text>
					<view class="desc">消费送积分</view>
					<view class="desc">积分可到积分商城内</view>
					<view class="desc">兑换商品</view>
					<image src="../../static/img/index-jf.png" mode="aspectFit"></image>
					<view class="btn">积分兑换</view>
				</view>
			</view>
			<!-- 商品列表界面 -->
			<view class="main-recommend-box">
				<view class="main-recommend-header">
					<view class="recommend-header-title" @click="changeClassify(0)" :class="{ active: pageType == 0 }"><text>猜你喜欢</text></view>
					<view class="recommend-header-title" @click="changeClassify(1)" :class="{ active: pageType == 1 }"><text>珊瑚盐珊瑚粮专区</text></view>
				</view>
				<shopping-list :list="commodityList" :hotType="pageType"></shopping-list>
			</view>
		</scroll-view>
		<tuiModal :show="modalShow" :custom="true" padding="0" width="auto" background="rgba(0,0,0,0)">
			<view class="adTip">
				<image src="@/static/img/main-back.png" mode="" class="back"></image>
				<image src="@/static/img/main-cloud.png" mode="" class="cloud"></image>
				<image src="@/static/img/main-fish.png" mode="" class="fish"></image>
				<image src="@/static/img/del.png" mode="" class="del" @click="closeAdTip()"></image>
				<view class="ad-box">
					<view class="top">使用积分卡</view>
					<view class="middle">此卡积分满足100可在积分商城购买商品和兑换商品</view>
					<view class="bottom" @click="cardPonintPage"><button type="default" class="bottom-btn">进入积分商城</button></view>
				</view>
			</view>
		</tuiModal>
		<!-- 悬浮分享按钮 -->
		<share-popup></share-popup>
		<tab-bar :current="0" selectedColor="#333333" color="#999999"></tab-bar>
	</view>
</template>

<script>
import shoppingList from '@/components/ocen-shopping-list/shopping-list.vue';
import sharePopup from '@/components/sharePopup/sharePopup.vue';
import tabBar from '@/components/tabbar/tabbar.vue';
import { mapState, mapMutations } from 'vuex';
import { getBanner, productCateList, newProductList, hotProductList, getRemind } from '../../api/main/main.js';
export default {
	data: () => ({
		pageType: 0, //默认显示哪个分类
		setPage: {
			//显示的页数
			pageNum: 1,
			pageSize: 12
		},
		hotType: 0, //设置是否显示历史价格
		// bannerList: [{ pic: '' }], //banner列表
		remindList: [], //温馨提示
		// mainClassifyList: [], //分类显示列表
		commodityList: [], //显示推荐商品的列表
		modalShow: false, //模态框是否显示
		scrollTop: 0, //滚动高度
		goTopShow: false, //设置是否显示跳到顶部
		oldScrollTop: 0,
		setScrollTop: false,
		setScrollTop: false,
		bannerAutoPlay: true,
		share: {
			// 页面分享
			title: '智海海洋小程序首页',
			path: '/pages/main/main',
			imageUrl: '',
			desc: '',
			content: ''
		},
		ranking_amount: [],
		ranking_integral: []
	}),
	onShow() {
		uni.getStorage({
			key: 'homeStatus',
			success: () => {
				this.getBannerList();
				this.getProductCateList();
			}
		});
		this.$http.get('/home/getLadderList').then(res => {
			this.ranking_amount = res.data.data;
		});
		this.$http.get('/home/getLeagueTable').then(res => {
			this.ranking_integral = res.data.data;
		});
	},
	methods: {
		...mapMutations(['setWindowHeight', 'getNoheaderBodyHeight', 'getHeaderHeight', 'getBodyHeight']),
		...mapMutations('user', ['getBannerList', 'getProductCateList']),
		// 跳转页面
		goPonintPage() {
			// 跳到user页面
			if (this.$utils.goLoginPage('login/login')) {
				return;
			}
			uni.navigateTo({
				url: '/pages/main/ponint-shop/ponint-shop'
			});
		},
		navTo(url) {
			// if (this.$utils.goLoginPage('login/login')) {
			// 	return;
			// }
			uni.navigateTo({
				url
			});
		},
		// 跳转搜索页面
		goSearchPage() {
			uni.navigateTo({
				url: '/pages/main/search-view/search-view'
			});
		},
		// 跳转分类页面
		goClassifyResultPage(value) {
			// console.log('This is ',encodeURIComponent(JSON.stringify(value)))
			console.log(value)
			if (value.level == 0) {
				console.log(value.id);
				uni.setStorageSync('category_id', value.id);
				uni.switchTab({
					url: '/pages/main/classify/classify'
				});
			} else {
				uni.navigateTo({
					url: '/pages/main/classify-result/classify-result?value=' + encodeURIComponent(JSON.stringify(value))
				});
			}
		},
		//关闭页面
		closeAdTip() {
			this.modalShow = false;
			let str = new Date().getTime();
			// uni.setStorageSync('modelShowTime', str);
			uni.setStorage('modelShowTime', str);
		},
		// 改变当前显示的商品
		changeClassify(type) {
			this.pageType = type;
			this.setPage.pageNum = 1;
			this.getCommodityList();
		},
		onLoadMore(e) {
			// 加载更多
			this.getLastList();
		},

		// 获取页面属性
		getPageData() {
			let res = uni.getSystemInfoSync();
			let one = parseInt(this.windowHeight) - parseInt(this.$refs.header.height) - parseInt(res.statusBarHeight) + 'px';
			let two = parseInt(res.statusBarHeight) + parseInt(this.$refs.header.height) + 'px';
			uni.getSystemInfo({
				success: res => {
					let three = parseInt(res.screenHeight) - parseInt(two) + 'px';
					this.getBodyHeight(three);
					// uni.setStorageSync('three', three);
					uni.setStorage('three', three);
				}
			});
			// uni.setStorageSync('one', one);
			// uni.setStorageSync('two', two);
			uni.setStorage('one', one);
			uni.setStorage('two', two);
			this.getNoheaderBodyHeight(one);
			this.getHeaderHeight(two);
		},

		// 轮播图点击
		handleFullImage(e) {
			// console.log(e)
			var arr = this.classifyList[0].children;
			for (var i = 0; i < arr.length; i++) {
				if (e.name.toLowerCase() == arr[i].name.toLowerCase()) {
					uni.navigateTo({
						url: '/pages/main/classify-result/classify-result?value=' + encodeURIComponent(JSON.stringify(arr[i]))
					});
				}
			}
		},

		// 获取banner
		async getBanner() {
			let res = await getBanner();
			let arr = res.data.data.advertiseList;
			// let oldbannerList = uni.getStorageSync('oldbannerList');
			// let bannerList = uni.getStorageSync('bannerList');
			let oldbannerList = uni.getStorage('oldbannerList');
			let bannerList = uni.getStorage('bannerList');
			let dataBoolean = false;
			// 判断是否存在旧数据
			if (!bannerList) {
				dataBoolean = true;
			}
			if (oldbannerList) {
				// console.log('旧数据存在')
				if (oldbannerList.length == arr.length) {
					// console.log('旧数据长度一致')
					await arr.forEach(async (item, index) => {
						if (item.pic != oldbannerList[index].pic) {
							// console.log('旧数内容不一致')
							dataBoolean = true;
						} else {
							// console.log('旧数内容一致')
							dataBoolean = false;
						}
					});
				} else {
					// console.log('旧数据长度不一致')
					dataBoolean = true;
				}
			} else {
				// console.log('旧数据不存在')
				dataBoolean = true;
			}
			if (dataBoolean) {
				// console.log('旧数据有问题，需要重新刷新')
				await uni.setStorage({
					key: 'oldbannerList',
					data: arr
				});
				await arr.forEach(async (item, index) => {
					if (item.pic.indexOf('mp4') == -1) {
						let [err, data] = await uni.downloadFile({
							url: item.pic
						});
						item.pic = data.tempFilePath;
						// uni.setStorageSync('bannerList',arr)
						uni.setStorage({
							key: 'bannerList',
							data: arr
						});
					}
				});
				let arr1 = arr;
				// console.log('数据进行替换',arr1)
				this.bannerList = arr1;
			} else {
				// console.log('旧数据新数据一致直接替换')
				// console.log(bannerList)
				this.bannerList = bannerList;
			}
		},

		// 获取温馨提示
		async getRemind() {
			let data = await getRemind();
			this.remindList = data.data.data.remindList;
			// console.log(data.data.data.remindList);
		},

		// 获取首页分类图
		async productCateList() {
			let res = await productCateList();
			// console.log(res)
			// return
			let arr = res.data.data;
			// let oldmainClassifyList = uni.getStorageSync('oldmainClassifyList');
			// let mainClassifyList = uni.getStorageSync('mainClassifyList');
			let oldmainClassifyList = uni.getStorage('oldmainClassifyList');
			let mainClassifyList = uni.getStorage('mainClassifyList');
			let dataBoolean = false;
			// console.log(this.mainClassifyList)
			if (!mainClassifyList) {
				dataBoolean = true;
			}
			if (oldmainClassifyList) {
				// console.log('旧数据存在')
				if (oldmainClassifyList.length == arr.length) {
					// console.log('旧数据长度一致')
					await arr.forEach(async (item, index) => {
						if (item.icon != oldmainClassifyList[index].icon) {
							// console.log('旧数内容不一致')
							dataBoolean = true;
						} else {
							// console.log('旧数内容一致')
							dataBoolean = false;
						}
					});
				} else {
					// console.log('旧数据长度不一致')
					dataBoolean = true;
				}
			} else {
				// console.log('旧数据不存在')
				dataBoolean = true;
			}
			if (dataBoolean) {
				// console.log('旧数据有问题，需要重新刷新')
				await uni.setStorage({
					key: 'oldmainClassifyList',
					data: arr
				});
				await arr.forEach(async (item, index) => {
					if (item.icon.indexOf('mp4') == -1) {
						let [err, data] = await uni.downloadFile({
							url: item.icon
						});
						item.icon = data.tempFilePath;
						// uni.setStorageSync('bannerList',arr)
						uni.setStorage({
							key: 'mainClassifyList',
							data: arr
						});
					}
				});
				let arr1 = arr;
				// console.log('数据进行替换',arr1)
				this.mainClassifyList = arr1;
			} else {
				// console.log('旧数据新数据一致直接替换')
				// console.log(bannerList)
				this.mainClassifyList = mainClassifyList;
			}
		},

		// 根据type值获取商品数据
		async getCommodityList() {
			let data = {};
			this.pageType == 0 ? ((data = await newProductList(this.setPage)), (this.hotType = false)) : ((data = await hotProductList(this.setPage)), (this.hotType = true));
			this.commodityList = data.data.data;
			// console.log(data)
			// this.total=
			// console.log(this.commodityList);
		},

		// 后续push添加数据
		async getLastList() {
			let data = {};
			this.setPage.pageNum++;
			this.pageType == 0 ? (data = await newProductList(this.setPage)) : (data = await hotProductList(this.setPage));
			data.data.data.forEach(item => {
				this.commodityList.push(item);
			});
		},

		// 设置消息图显示
		setModalShow() {
			// let date = uni.getStorageSync('modelShowTime');
			let date = uni.getStorage('modelShowTime');
			let newDate = new Date().getTime();
			if (newDate - date > 86400000) {
				// if((newDate-date)>8000){
				this.modalShow = true;
			} else {
				this.modalShow = false;
			}
		},

		// 从首页弹窗卡跳转积分页面
		cardPonintPage() {
			this.closeAdTip();
			if (this.$utils.goLoginPage('login/login')) {
				return;
			}
			uni.navigateTo({
				url: '/pages/main/ponint-shop/ponint-shop'
			});
		},
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
			// this.$utils.goLoginPage("login/login")
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

		// 设置播放事件
		setVideoPlay(value) {
			this.bannerAutoPlay = value;
		},

		// 设置轮播视频暂停
		changeSwiper(e) {
			const itemid = e.detail.currentItemId;
			if (itemid.indexOf('mp4') == -1) {
				this.videoContext.pause();
			} else {
				this.videoContext.play();
			}
		},
		// 获取分类列表数据
		async categoryTreeList() {
			let data = await categoryTreeList();
			let oldclassList = uni.getStorageSync('oldclassList');
			let classList = uni.getStorageSync('classList');
			let dataBoolean = false;
			// this.classifyList=data.data.data
			let arr = data.data.data;

			if (!classList || !oldclassList) {
				// console.log('不存在1数据')
				dataBoolean = true;
			}
			// console.log(arr.length,oldclassList.length)
			if (arr.length != oldclassList.length) {
				// console.log('数据不正确')
				dataBoolean = true;
			}

			if (oldclassList) {
				arr.forEach((item, index) => {
					item.children.forEach((items, key) => {
						if (items.icon != oldclassList[index].children[key].icon) {
							// console.log('数据不正确')
							dataBoolean = true;
						}
					});
				});
			}

			if (dataBoolean) {
				let setData = await new Promise(async (res, rej) => {
					await uni.setStorage({
						key: 'oldclassList',
						data: arr
					});
					await arr.forEach((item, index) => {
						item.children.forEach(async (items, key) => {
							let [err, classPic] = await uni.downloadFile({
								url: items.icon
							});
							// console.log(classPic.tempFilePath)
							arr[index].children[key].icon = classPic.tempFilePath;
							uni.setStorageSync('classList', arr);
						});
					});
					res(arr);
				});
				this.classifyList = setData;
			} else {
				this.classifyList = classList;
			}
			// console.log(data.data.data)
		},

		// 初始化
		init() {
			// this.getBanner();
			this.setWindowHeight();
			// this.productCateList();
			this.getCommodityList();
			this.getRemind();
			this.setModalShow();
		}
	},
	mounted() {
		this.getPageData();
		console.log(this.classifyList);
	},
	onLoad() {
		// 初始化
		this.init();
	},
	onReady() {
		this.videoContext = uni.createVideoContext('swiper-video');
	},
	components: {
		shoppingList,
		sharePopup,
		tabBar
	},
	computed: {
		...mapState(['windowHeight', 'setBodyHeight', 'setHeaderHeight']),
		...mapState('user', ['bannerList', 'mainClassifyList', 'classifyList']),
		setRemindList() {
			let arr = [];
			this.remindList.forEach(item => {
				arr.push(item.content);
			});
			// console.log('this is arr', arr.join('|'));
			return arr.join('    ');
		}
	},
	onShareAppMessage(res) {
		// console.log(res)
		if (res.from === 'button') {
			console.log(getCurrentPages()[getCurrentPages().length - 1]);
			return {
				title: '智海海洋',
				path: '/pages/main/main'
			};
		}
	}
};
</script>

<style>
scroll-view ::-webkit-scrollbar {
	width: 0;
	height: 0;
	background-color: transparent;
}
</style>
<style lang="scss">
.main {
	background: rgba(238, 238, 238, 1);
	width: 750rpx;
	// position: fixed;
	position: relative;
}

// 头部
.main-header {
	width: 750rpx;
	min-height: 136rpx;
	background: linear-gradient(72deg, rgba(22, 120, 255, 1) 60%, rgba(7, 92, 247, 1));
}

.main-header-icon {
	font-family: PingFang SC;
	font-weight: 400;
	font-size: 36rpx;
	color: rgba(255, 255, 255, 0.8);
	width: 99rpx;
	height: 28rpx;
	margin: 0 20rpx;
	height: 100%;
	position: relative;

	image {
		height: 75rpx;
		width: 75rpx;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
	}
}

.main-header-search-box {
	display: flex;
	justify-content: space-between;

	.main-header-search {
		position: relative;

		.main-header-search-icon {
			width: 23rpx;
			height: 23rpx;
			margin-left: 18rpx;
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
		}

		.main-header-search-input {
			width: 420rpx;
			height: 65rpx;
			background: rgba(255, 255, 255, 0.24);
			border-radius: 35rpx;
			font-size: 22rpx;
			line-height: 65rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(255, 255, 255, 1);
			margin-left: -20rpx;
		}

		.main-header-search-text {
			font-size: 28rpx;
			position: absolute;
			color: rgba(255, 255, 255, 0.7);
			padding-left: 56rpx;
		}
	}
}

// banner部位
.main-banner {
	width: 750rpx;
	background: rgba(255, 255, 255, 1);
	box-shadow: 0px 0px 21px 0px rgba(119, 119, 119, 0.16);
}

.main-swiper-box {
	width: 690rpx;
	height: 307rpx;
	margin: 0 30rpx;
	padding: 20rpx 0;
	overflow: hidden;
}

.main-swiper {
	width: 100%;
	height: 100%;
	border-radius: 30rpx;
	overflow: hidden;

	.swiper {
		width: 100%;
		height: 100%;
	}

	.swiper-item-box {
		width: 100%;
		height: 100%;
	}

	.swiper-item {
		width: 100%;
		height: 100%;
		position: relative;

		video {
			height: 100%;
			width: 100%;
		}
	}

	.swiper-item-image {
		image {
			width: 100%;
			height: 100%;
			background-color: #027197;
			margin: 0;
		}
	}

	.swiper-item-title {
		position: absolute;
		z-index: 1;
		color: white;
		padding-top: 30rpx;

		.swiper-first-title {
			background: rgba(0, 0, 0, 0);
			font-family: SimHei;
			font-weight: 400;
			color: rgba(238, 238, 238, 1);
			letter-spacing: 10rpx;
			font-size: 32rpx;
			padding: 8rpx 15rpx;
			margin: 0 35rpx;
			border: 1rpx solid rgba(182, 182, 182, 255);
			border-radius: 10rpx;
			text-align: center;
		}

		.swiper-last-title {
			display: block;
			background: rgba(0, 0, 0, 0);
			color: rgba(238, 238, 238, 1);
			font-size: 28rpx;
			margin: 15rpx 40rpx;
			width: 320rpx;
			text-align: left;
		}
	}
}

// banner位置的分类栏
.category-swiper {
	width: 100%;
	height: 350rpx;
}

.main-classify-box {
	margin: 0 30rpx;
}

.main-classify {
	width: 100%;
	display: flex;
	flex-wrap: wrap;
}

.main-classify-item {
	width: 20%;
	display: inline-block;
}

.main-classify-item.hidden {
	display: none;
}

.main-classify-icon-box {
	overflow: hidden;
	height: 90rpx;
	display: flex;
	justify-content: space-around;

	.main-classify-icon image {
		border-radius: 12rpx;
		width: 90rpx;
		height: 90rpx;
		margin: 0 auto;
	}
}

.main-classify-title {
	font-size: 28rpx;
	width: 100%;
	text-align: center;
	font-family: SimHei;
	font-weight: 400;
	color: rgba(51, 51, 51, 1);
	margin-top: 8.4rpx;
	// margin-bottom: 36rpx;
}

.set-main-classify-title {
	margin-bottom: 20rpx;
}

.main-text-roll {
	width: 750rpx;
	background: rgba(255, 251, 240, 1);
	border-radius: 10px;
	position: relative;
}

// 文字滚动栏
.text-roll-box {
	min-width: 650rpx;
	height: 45rpx;
	margin: 0 auto;
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	margin: 0 50rpx;
	display: flex;

	.text-roll-icon-box {
		height: 45rpx;
		width: 45rpx;
		position: relative;

		.text-roll-icon {
			height: 35rpx;
			width: 35rpx;
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
		}
	}

	.text-roll-text {
		display: inline-block;
		font-size: 28rpx;
		line-height: 40rpx;
		margin-left: 25rpx;
		font-family: Source Han Sans CN;
		font-weight: 400;
		color: rgba(51, 51, 51, 1);
	}
}

// 点击商品栏目
.main-integral-box {
	height: 274rpx;
	width: 750rpx;
	position: relative;

	.main-integral {
		margin: 30rpx 30rpx;
		height: 274rpx;
		border-radius: 8rpx;
	}

	.main-integral-image {
		width: 100%;
		height: 100%;
	}

	.main-integral-text {
		position: absolute;
		z-index: 1;

		.integral-first-title {
			margin-top: 70rpx;
			margin-left: 46rpx;
			font-size: 39rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: rgba(255, 255, 255, 1);
		}

		.integral-last-title {
			font-size: 24rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(255, 255, 255, 0.8);
			margin-top: 20rpx;
			margin-left: 50rpx;
			width: 250rpx;
		}

		.last-top {
			display: block;
			text-align: left;
			font-size: 32rpx;
		}

		.last-bottom {
			display: block;
			text-align: right;
			font-size: 32rpx;
		}
	}
}

// 商品推荐列表
.main-recommend-box {
	width: 750rpx;
	background-color: rgba(255, 255, 255, 1);
	min-height: 400rpx;
	margin-top: 30rpx;
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
		font-family: Source Han Sans CN;
		font-weight: bold;
		color: #999999;
	}

	.recommend-header-title.active {
		box-sizing: border-box;
		color: #333333;
		border-bottom: 4rpx solid #333333;
	}
}

.main-bottom {
	height: 5vh;
	background-color: white;
}

// 提示框
.adTip {
	width: 630rpx;
	height: 760rpx;
	position: relative;

	.back {
		width: 100%;
		height: 100%;
		position: absolute;
	}

	.cloud {
		position: absolute;
		width: 680rpx;
		height: 195rpx;
		top: 167rpx;
		left: 50%;
		transform: translateX(-50%);
		z-index: 10;
	}

	.fish {
		position: absolute;
		height: 280rpx;
		width: 270rpx;
		top: 50rpx;
		left: 50%;
		transform: translateX(-50%);
		z-index: 9;
	}

	.del {
		height: 70rpx;
		width: 70rpx;
		position: absolute;
		right: -20rpx;
		top: -20rpx;
	}

	.ad-box {
		width: 400rpx;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		bottom: 72rpx;
		z-index: 11;

		.top {
			text-align: center;
			font-size: 50rpx;
			font-family: PangMenZhengDao;
			font-weight: 400;
			color: rgba(9, 103, 245, 1);
			padding-bottom: 80rpx;
		}

		.middle {
			font-size: 30rpx;
			line-height: 50rpx;
			letter-spacing: 1rpx;
			font-weight: 500;
			text-align: center;
			color: rgba(51, 51, 51, 1);
			padding-bottom: 70rpx;
		}

		.bottom {
			position: relative;
			bottom: 0;

			.bottom-btn {
				height: 55rpx;
				line-height: 55rpx;
				font-size: 30rpx;
				font-weight: 400;
				color: rgba(255, 255, 255, 0.8);
				background: rgba(12, 112, 247, 1);
				border-radius: 10rpx;
			}
		}
	}
}

.uniNoticeBar {
	height: 100%;
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
	bottom: 160rpx;
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

.integral-main {
	width: 100%;
	display: flex;
	justify-content: space-between;
	box-sizing: border-box;
	padding: 0 2.67vw;
	margin-top: 30rpx;

	.left {
		width: 46.67vw;
		display: flex;
		flex-direction: column;
		align-items: center;

		> view {
			width: 100%;
			// height: 27.33vw;
			display: flex;
			flex-direction: column;
			background: white;
			border-radius: 1vw;

			> text {
				width: 16vw;
				height: 5.33vw;
				display: flex;
				align-items: center;
				justify-content: center;
				background: linear-gradient(265deg, #f53147 0%, #f15236 100%);
				font-size: 3.73vw;
				font-weight: bold;
				color: white;
				border-radius: 1vw 0 1vw 0;
			}

			> view {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-around;
				margin-top: 2.13vw;
				margin-bottom: 1.73vw;

				> view {
					width: calc(100% / 3);
					display: flex;
					flex-direction: column;
					align-items: center;
					position: relative;
					font-size: 2.4vw;

					> image {
						width: 10.93vw;
						margin-bottom: 2vw;
					}

					> image:nth-child(2) {
						width: 8.8vw;
						height: 8.8vw;
						border-radius: 50%;
						position: absolute;
						top: 6vw;
					}

					> text {
						width: 100%;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						text-align: center;
					}
				}

				> view:nth-child(2) {
					transform: translateY(-0.2vw);
					> image {
						width: 14vw;
					}

					> image:nth-child(2) {
						width: 11vw;
						height: 11vw;
						top: 7.2vw;
					}
				}

				> view:nth-child(3) {
					> image:nth-child(1) {
						transform: translateY(0.4vw);
					}
				}
			}
		}

		> view + view {
			margin-top: 1.33vw;

			> text {
				background: linear-gradient(90deg, #e5b242 0%, #be912f 100%);
			}
		}
	}

	.right {
		width: 46.67vw;
		display: flex;
		flex-direction: column;
		position: relative;
		background: white;
		border-radius: 1vw;
		box-sizing: border-box;
		padding: 5.87vw 3.6vw;

		> text {
			font-size: 4.8vw;
			font-weight: bold;
			margin-bottom: 2.13vw;
		}

		.desc {
			font-size: 2.4vw;
			color: #757575;
		}

		> image {
			width: 34vw;
			height: 34vw;
			position: absolute;
			right: 2vw;
			top: 12vw;
		}

		.btn {
			width: 32vw;
			height: 6.67vw;
			display: flex;
			align-items: center;
			justify-content: center;
			border: 1px #e89800 solid;
			color: #e89800;
			border-radius: 10vw;
			margin: auto;
			margin-bottom: 0;
		}
	}
}
</style>
