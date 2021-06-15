<template>
	<view class="classify">
		<hxNavbar :back="false" :fixed="true" title="分类" color="#ffffff"></hxNavbar>
		<view class="classify-body">
			<scroll-view class="classify-select" :scroll-y="true" :show-scrollbar="false">
				<view v-for="(item, key) in classifyList" :key="key" @click="changeSelectIndex(key,item)" :class="{ active: selectIndex == key, 'classify-select-title': true }">
					<!-- <img class="classify-select-icon" :src="item.icon"></img> -->
					<text class="select-text">{{ item.name }}</text>
				</view>
				<view class="classify-select-bottom"></view>
			</scroll-view>
			<scroll-view class="classify-commodity" :scroll-y="true">
				<view class="classify-commodity-title">{{ classifyList[selectIndex].name }}</view>
				<!-- <block v-for="(item, key) in classifyList[selectIndex].children" :key="key"></block> -->
				<view class="classify-commodity-list" v-show="classifyList[selectIndex]">
					<view class="commodity-list-item" v-for="(item, key) in classifyList[selectIndex].children" :key="key">
						<view class="list-box" @click="goClassifyResultPage(item)">
							<easyimage :image-src="item.icon" mode="" :setIcon="true" class="list-item-img" :key="item.icon"></easyimage>
							<text class="list-item-text">{{ item.name }}</text>
						</view>
					</view>
				</view>
				<view class="classify-commodity-bottom"></view>
			</scroll-view>
		</view>
		<!-- 悬浮分享按钮 -->
		<share-popup></share-popup>
		<!-- tabBar -->
		<tab-bar :current="1" selectedColor="#333333" color="#999999"></tab-bar>
	</view>
</template>

<script>
import sharePopup from '@/components/sharePopup/sharePopup.vue';
import tabBar from '@/components/tabbar/tabbar.vue';
import { categoryTreeList } from '../../../api/main/classify.js';
import { mapState } from 'vuex';
export default {
	data: () => ({
		selectIndex: 0, //默认选择index
		share: {
			// 页面分享
			title: '智海海洋小程序分类',
			path: '/pages/main/clssify/clssify',
			imageUrl: '',
			desc: '',
			content: ''
		}
		// classifyList: []
	}),
	methods: {
		// 修改类型值
		changeSelectIndex(key,item) {
			this.selectIndex = key;
			uni.setStorageSync('category_id', item.id);
		},
		// 页面跳转
		goClassifyResultPage(value) {
			// console.log(value)
			uni.navigateTo({
				url: '/pages/main/classify-result/classify-result?value=' + encodeURIComponent(JSON.stringify(value))
			});
		},
		// 获取列表数据
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
		setIndex() {
			if (uni.getStorageSync('category_id')) {
				this.classifyList.forEach((item, index) => {
					if (item.id == uni.getStorageSync('category_id')) this.selectIndex = index;
				});
			}
		}
	},
	computed: {
		...mapState('user', ['classifyList'])
	},
	onLoad(options) {
		// this.categoryTreeList();
	},
	onShow() {
		console.log(this.classifyList);
		setTimeout(() => {
			this.setIndex();
		}, 500);
	},
	components: {
		sharePopup,
		tabBar
	},
	onShareAppMessage(res) {
		// console.log(res)
		return {
			title: '智海海洋',
			path: '/pages/main/main'
		};
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
<style lang="scss" scoped>
// 头部
.main-header-icon {
	font-family: PingFang SC;
	font-weight: 400;
	font-size: 36rpx;
	color: rgba(255, 255, 255, 0.8);
	width: 99rpx;
	height: 28rpx;
	margin: 0 20rpx;
	height: 100%;
}

// 身体
.classify-body {
	background: rgba(238, 238, 238, 1);
	width: 750rpx;
	display: flex;
	height: 95vh;
	position: fixed;
	justify-content: space-between;
}

.classify-select {
	width: 210rpx;
	height: 100%;
	border-right: 4rpx solid rgba(238, 238, 238, 1);
	background-color: white;

	.classify-select-title {
		display: flex;
		align-items: center;
		height: 80rpx;
		color: rgba(51, 51, 51, 1);
		font-size: 32rpx;
		font-weight: 500;
		text-align: center;

		.select-text {
			width: 100%;
		}
	}

	.classify-select-title.active {
		background: rgba(238, 238, 238, 1);
		color: #333333;
		// .select-text {
		// 	border-left: 5rpx solid #333333;
		// }
	}

	.classify-select-bottom {
		height: 12vh;
	}
}

.classify-commodity {
	flex: 1;
	padding-right: 20rpx;
	height: 100%;
	background-color: white;

	.classify-commodity-title {
		padding-left: 30rpx;
		padding-top: 10rpx;
		padding-bottom: 35rpx;
		font-size: 30rpx;
		font-weight: 600;
		color: rgba(51, 51, 51, 1);
	}

	.classify-commodity-list {
		display: flex;
		flex-wrap: wrap;
	}

	.classify-commodity-bottom {
		height: 12vh;
	}
}

.commodity-list-item {
	width: 33%;
	margin-bottom: 26rpx;

	.list-box {
		width: 128rpx;
		margin: 0 auto;
	}

	.list-item-text {
		display: inline-block;
		width: 128rpx;
		text-align: center;
		font-size: 26rpx;
		font-weight: 500;
		color: rgba(102, 102, 102, 1);
	}
}

.list-item-img image {
	width: 128rpx;
	height: 128rpx;
	overflow: hidden;
}
</style>
