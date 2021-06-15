<template>
	<view class="collect">
		<!-- 浮窗弹出 -->
		<tuiModal :show="setModalShow" @click="closeCollerList" title="提示" content="是否要删除选择内容"></tuiModal>
		<!-- toast提示 -->
		<toast ref="toast"></toast>
		<!-- 身体 -->
		<scroll-view class="collect-body" :scroll-y="true" >
			<!-- 头部 -->
			<hxNavbar :back="true" :fixed="true" :scroll-y="true" title="我的收藏" color="#ffffff" />
			<!-- 选择全选 -->
			<view class="all-select-box">
				<view class="left"><text v-if="allCheck" @click="setAllSelct">全选</text></view>
				<view class="right" @click="changeAllSelect()">
					<text v-if="allCheck">完成</text>
					<text v-if="!allCheck">管理</text>
				</view>
			</view>
			<view class="all-select-box1"></view>
			<!-- 搜索列表显示栏目 -->
			<view class="res-list">
				<view class="content-no-text" v-if="!collectList[0]">
					<image src="@/static/img/blank.png" mode="" class="content-blank"></image>
					<view class="content-blank-text">暂无收藏</view>
				</view>
				<view class="list-item-box" v-if="collectList[0]" v-for="(item, key) in collectList" :key="key">
					<view class="item-check-box" v-if="allCheck" @click="setShowArr(key)">
						<image src="@/static/img/check.png" mode="" v-if="!setItemCheckShow[key]"></image>
						<image src="@/static/img/checked.png" mode="" v-if="setItemCheckShow[key]"></image>
					</view>
					<view class="item-image-box"><image class="item-image" :src="item.productPic"></image></view>
					<view class="item-title-box">
						<view class="item-title">
							<view class="title">{{ item.productName }}</view>
						</view>
						<view class="item-price">
							<view class="price">￥{{ item.productPrice }}</view>
						</view>
					</view>
					<button type="default" class="item-btn" v-if="!allCheck" @click="goCommonDetails(item)">购买</button>
				</view>
				<view class="bottom-del1" v-if="allCheck"></view>
			</view>
		</scroll-view>
		<view class="bottom-del" v-if="allCheck">
			<view class="del">
				<image src="@/static/img/delete.png" mode="" class="del-image"></image>
				<view class="del-text" @click="showModal">删除</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getColletList } from '@/api/user/user.js';
import { closeCollerList, productDetail } from '@/api/main/main.js';
import { mapState } from 'vuex';
export default {
	data: () => ({
		setPage: {
			//显示的页数
			pageNum: 1,
			pageSize: 12
		},
		collectList: [],
		allCheck: false,
		setModalShow: false,
		setItemCheckShow: []
	}),
	methods: {
		// 更改全选状态
		changeAllSelect() {
			this.allCheck = !this.allCheck;
			this.collectList.forEach((item, key) => {
				this.setItemCheckShow.splice(key, key + 1, false);
			});
		},
		// 获取数据
		async getColletList() {
			let data = await getColletList(this.setPage);
			if(data.data.code==200){
				this.collectList = data.data.data.list;
			}
			// console.log(data.data.data.list)
		},
		// 弹出弹窗
		showModal() {
			this.setItemCheckShow.forEach(item => {
				if (item) {
					this.setModalShow = true;
				}
			});
			// 开启弹窗
			if (this.setItemCheckShow.join(',').indexOf('true') == -1) {
				this.$refs.toast.show({
					title: '请选择删除的内容',
					duration: 1000
				});
			}
		},
		// 删除收藏商品
		async closeCollerList(e) {
			// 关闭弹窗
			if (e.index == 1) {
				let arr = [];
				this.setItemCheckShow.forEach((item, key) => {
					if (item) {
						arr.push(this.collectList[key].productId);
					}
				});
				// console.log(arr)
				let data = await closeCollerList(arr);
				// 重新拉取数据
				if (data.data.code == 200) {
					this.getColletList();
					this.setModalShow = false;
					this.allCheck = false;
					this.$refs.toast.show({
						title: '删除成功',
						duration: 1000
					});
				}
				// console.log(data)
			} else if (e.index == 0) {
				this.setModalShow = false;
			}
		},
		// 跳转商品详情页面
		async goCommonDetails(item) {
			let data = await productDetail(item.productId);
			let value = data.data.data.product;
			console.log(data)
			value.hotType = 1;	
			uni.navigateTo({
				// url: '/pages/main/commodity-details/commodity-details?data=' + encodeURIComponent(JSON.stringify(value))
				url: '/pages/main/commodity-details/commodity-details?data=' + value.id + '&hotType=' + value.hotType
				
			});
		},
		// 设置是否显示字体
		setShowArr(index) {
			let boolen = !this.setItemCheckShow[index];
			this.$set(this.setItemCheckShow, index, boolen);
		},
		// 全选
		setAllSelct() {
			if (this.setItemCheckShow.join('').indexOf('false') > -1) {
				this.collectList.forEach((item, key) => {
					this.$set(this.setItemCheckShow, key, true);
				});
			} else {
				this.collectList.forEach((item, key) => {
					this.$set(this.setItemCheckShow, key, false);
				});
			}
		}
	},
	onLoad() {
		this.getColletList();
	},
	onShow() {
		this.setPage.pageNum=1;
		this.getColletList();
	},
	watch: {
		collectList: {
			handler() {
				if(this.collectList){
					if(this.collectList.length>0){
						this.collectList.forEach((item, index) => {
							this.setItemCheckShow[index] = false;
						});
					}
				}
				immediate: true;
			}
		}
	},
	computed: {
		...mapState(['bodyHeight'])
	}
};
</script>

<style lang="scss" scoped>
//全部
.collect {
	// height: 100vh;
	width: 750rpx;
}
// 全选
.all-select-box {
	display: flex;
	justify-content: space-between;
	line-height: 70rpx;
	height: 70rpx;
	margin-top: -3rpx;
	// padding: 0 34rpx;
	width: 100%;
	font-size: 30rpx;
	font-weight: 500;
	color: rgba(102, 102, 102, 1);
	position: fixed;
	z-index: 12;
	background-color: white;
	// top: 0;
	.left {
		padding-left: 30rpx;
	}
	.right {
		padding-right: 30rpx;
	}
}
.all-select-box1 {
	width: 100%;
	height: 70rpx;
}

// 搜索结果列表
.res-list {
	width: 750rpx;
}
.list-item-box {
	position: relative;
	height: 268rpx;
	margin: 0 30rpx;
	display: flex;
	background: rgba(255, 255, 255, 1);
	box-shadow: 0rpx 0px 8rpx 0rpx rgba(119, 119, 119, 0.29);
	border-radius: 10rpx;
	margin-top: 20rpx;
}
.list-item-box:nth-child(1) {
	margin-top: 0;
}
.item-check-box {
	width: 40rpx;
	height: 268rpx;
	position: relative;
	image {
		width: 30rpx;
		height: 30rpx;
		position: absolute; 
		top: 138rpx;
		transform: translateY(-50%);
		left: 10rpx;
	}
}
.item-image-box {
	height: 268rpx;
	margin: 0 20rpx;
	.item-image {
		height: 222rpx;
		margin: 23rpx 0;
		width: 222rpx;
	}
}
.item-title-box {
	margin: 0 20rpx;
	position: relative;
	.item-title {
		font-size: 30rpx;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		padding: 40rpx 0;
		padding-right: 30rpx;
	}
	.item-price {
		position: absolute;
		color: #fc050b;
		font-size: 35rpx;
		bottom: 40rpx;
	}
}
.item-btn {
	color: #a2a2a2;
	background-color: white;
	height: 60rpx;
	width: 150rpx;
	font-size: 30rpx;
	line-height: 60rpx;
	text-align: center;
	position: absolute;
	bottom: 21rpx;
	right: 18rpx;
}

.collect-body {
	// background-color: yellow;
	position: relative;
	// background-color: red;
	height: 100vh;
	// z-index: 500;
}
.bottom-del {
	height: 110rpx;
	width: 100%;
	background-color: white;
	position: absolute;
	bottom: 0;
	.del {
		display: inline-block;
		overflow: hidden;
		border: 1rpx solid rgba(153, 153, 153, 1);
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		right: 30rpx;
		border-radius: 30rpx;
		padding: 10rpx 20rpx;
		.del-image {
			width: 39rpx;
			height: 41rpx;
			float: left;
		}
		.del-text {
			color: #666666;
			float: right;
			padding-left: 20rpx;
		}
	}
}
.bottom-del1 {
	height: 110rpx;
	width: 100%;
}
.set-none {
	width: 100%;
	text-align: center;
	color: #666666;
	font-size: 40rpx;
}

.go-top {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	z-index: 10;
	position: fixed;
	bottom: 140rpx;
	right: 50rpx;
	transform: translateY(200rpx);
	transition: all .4s;
	image{
		position: absolute;
		z-index: 100;
		width: 100rpx;
		height: 100rpx;
	}
}
.isShowGo{
	transform: translateY(0rpx);
	transition: all .4s;
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
