<template>
	<view class="min-popup" v-if="show" :class="[isShow ? 'min-show' : 'min-hide']">
		<view class="min-overlay" @click="close()"></view>
		<view :class="size ? 'min-content-' + size : 'min-content'" :style="{ height: heightSize + 'rpx' }">
			<view class="closeBtn" @click="close()"><image src="@/static/img/del.png" mode=""></image></view>
			<view class="header">
				<view class="header-img-box"><image :src="commonData.skuStockList[selectIndex].pic" @click="enlarge(commonData.skuStockList[selectIndex].pic)" mode="" class="header-img"></image></view>
				<view class="header-text-box">
					<view class="header-top-text">
						<text v-if="moneyType != 2">￥{{selectIndex==-1?commonData.skuStockList[0].price: commonData.skuStockList[selectIndex].price }}</text>
						<text v-if="moneyType == 2">积分{{ commonData.skuStockList[selectIndex].points ? commonData.skuStockList[selectIndex].points:commonData.product.usePointLimit }}</text>
					</view>
					<view class="header-middle-text">
						<text>库存 {{ actualStock }} 件</text>
					</view>
					<view class="header-bottom-text">
						<text>{{ setShowAttr }}</text>
					</view>
				</view>
			</view>
			<view class="color-select">
				<view class="color-title"><text>选择规格</text></view>
				<scroll-view class="color-box" :scroll-y="true">
					<!-- <view :class="{ 'color-item': true, active: selectIndex == key }" v-for="(item, key) in commonData.skuStockList" @click="changeSelectIndex(key)" :key="key">
						<image :src="item.pic" mode="" class="item-image"></image>
						<text class="item-text">{{ item.spData | setAttr }}</text>
					</view> -->
					<view class="color-item" v-for="(item, key) in separateData" :key="key">
						<text class="title">{{key}}</text>
						<view class="color-list-box">
							<view class="color-list" :class="{active: separateIndex[key] == key1}" @click="changeSelectIndex(key, key1)" v-for="(item, key1) in item" :key="key1">
								<text class="item-text">{{ item }}</text>
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="item-count" v-if="moneyType != 2">
					<view class="count-title"><text>购买数量</text></view>
					<view class="set-count">
						<view class="set add" @click="setCommonCount('-')"><image src="@/static/img/remove.png" mode=""></image></view>
						<view class="count">{{ CommonCount }}</view>
						<view class="set remove" @click="setCommonCount('+')"><image src="@/static/img/add.png" mode=""></image></view>
					</view>
				</view>
			</view>
			<view class="cart-buy" v-if="moneyType < 2">
				<view class="set-buy-btn" v-if="type == 0">
					<view class="cart global-button-one" @click="joinShoppingCart">加入购物车</view>
					<view class="buy global-button-two" @click="goOrderPage">立刻购买</view>
				</view>
				<view class="set-buy-btn" v-if="type != 0">
					<view class="cart-cart global-button-one" v-if="type == 1" @click="joinShoppingCart">加入购物车</view>
					<view class="buy-buy global-button-two" v-if="type == 2" @click="goOrderPage">立刻购买</view>
				</view>
			</view>
			<view class="cart-buy" v-if="moneyType == 2">
				<view class="set-buy-btn"><view class="buy-buy global-button-two" @click="goOrderPage">立即兑换</view></view>
			</view>
		</view>
	</view>
</template>

<script>
import { addShoppingCart } from '@/api/main/main.js';
export default {
	props: {
		show: {
			type: Boolean
		},
		size: {
			type: String
		},
		heightSize: {
			type: String
		},
		commonData: {
			type: Object
		},
		type: {
			type: Number,
			default: 0
		},
		moneyType: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			isShow: Boolean,
			CommonCount: 1,
			selectIndex: 0,
			setShowAttr: '选择规格',
			separateIndex: {},
			currentData: [],
			iscomplete: false // 规格是否全部选择
			// getCommonData: []
		};
	},
	created() {
		this.isShow = this.show;
		// console.log('组件内的数据',this.commonData.skuStockList)
		setTimeout(() => {
			if(this.currentData[0]) {
				this.currentData.forEach((item, i) => {
					console.log('调用了', item.key, 0)
					this.changeSelectIndex(item.key, 0)
				})
			}
		},1000)
	},
	watch: {
		show() {
			this.isShow = this.show;
			console.log(this.commonData)
			this.CommonCount = 1;
			if (!this.show) {
				this.close();
			}
		},
		selectIndex: {
			immediate: true,
			handler() {
				if (this.iscomplete) {
					let arr = JSON.parse(this.commonData.skuStockList[this.selectIndex].spData);
					let str = '';
					arr.forEach(item => {
						str += `${item.value} `;
					});
					this.setShowAttr = str;
				}
			}
		}
	},
	beforeUpdate() {
		
	},
	methods: {
		enlarge(url) {
			// console.log(url)
			uni.previewImage({
				urls: [url]
			})
			// this.$emit("enlarge", url);
		},
		// 关闭窗口
		close() {
			this.isShow = false;
			setTimeout(() => {
				this.$emit('close');
			}, 200);
		},
		// 设置数量
		setCommonCount(value) {
			this.CommonCount > 0 ? (value == '+' ? this.CommonCount++ : this.CommonCount--) : value == '+' ? this.CommonCount++ : this.CommonCount;
		},
		// 选择
		changeSelectIndex(key,index) {
			var _this = this
			console.log('-=-=-=-=',key,index)
			var obj = {}
			obj[key] = index
			this.separateIndex = {		//当前选中的数组索引
				...this.separateIndex,
				...obj
			}
			// console.log(this.separateIndex)
			var currentList = this.currentData
			currentList.forEach((item, i) => {
				if(item.key == key) {
					console.log(this.separateData[key][index])
					item.value = this.separateData[key][index]
				}
			})
			// currentList[key] = this.separateData[key][index]
			this.currentData = currentList		//当前选中的对象
			console.log(this.currentData)
			// 循环判断是否全部选择
			var num = 0
			currentList.forEach((item, i) => {
				if(item.value == '') {
					num ++
				}
			})
			if(num == 0) {
				this.iscomplete = true
			}else {
				this.iscomplete = false
			}
			
			// 如果全部选择，确定商品规格id
			if(this.iscomplete) {
				var getCommonData = this.commonData
				getCommonData.skuStockList.forEach(function(item, i) {
					// var _item = JSON.parse(item.spData)
					// if(_item.length > maxlength) {
					// 	maxlength = _item.length
					// 	maxIndex = i
					// }
					if(item.spData == JSON.stringify(_this.currentData)) {
						_this.selectIndex = item.index;
						// console.log(item, JSON.stringify(_this.currentData))
					}
				})
			}
			console.log(JSON.stringify(this.currentData), _this.selectIndex)
			
			// this.selectIndex = index;
			this.$emit("sendPointsIndex", this.selectIndex);
		},
		// 兑换和购买接口
		goOrderPage() {
			
			if(this.CommonCount > this.actualStock) {
					uni.showToast({
					    title: '库存不足',
					    duration: 2000,
						icon: 'none'
					});
				return;
			}
			
			if(!this.iscomplete) {
				uni.showToast({
				    title: '请完善规格选择~',
				    duration: 2000,
					icon: 'none'
				});
				return
			}
			let data = {};
			data.skuStock = this.commonData.skuStockList[this.selectIndex]; //选择的规格
			data.data = this.commonData.product; //设置传入的内容
			data.buyType = this.moneyType;
			data.CommonCount = this.CommonCount;
			console.log(data)
			uni.navigateTo({
				url: '/pages/shopping-cart/confirm-order/confirm-order?data=' + encodeURIComponent(JSON.stringify(data))
			});
			this.close();
		},
		// 加入购物车
		async joinShoppingCart() {
			if(!this.iscomplete) {
				uni.showToast({
				    title: '请完善规格选择~',
				    duration: 2000,
					icon: 'none'
				});
				return
			}
			if(this.CommonCount > this.actualStock) {
					uni.showToast({
						title: '库存不足',
						duration: 2000,
						icon: 'none'
					});
				return;
			}
			
			let data = {
				deleteStatus: 0,
				price: this.commonData.skuStockList[this.selectIndex].price,
				productAttr: this.commonData.skuStockList[this.selectIndex].spData,
				productCategoryId: this.commonData.product.productCategoryId,
				productId: this.commonData.product.id,
				productName: this.commonData.product.name,
				productPic: this.commonData.skuStockList[this.selectIndex].pic,
				productSkuCode: this.commonData.skuStockList[this.selectIndex].skuCode,
				productSkuId: this.commonData.skuStockList[this.selectIndex].id,
				productSn: this.commonData.product.productSn,
				productSubTitle: this.commonData.product.subTitle,
				quantity: this.CommonCount
			};
			let res = await addShoppingCart(data);
			// console.log(res);
			this.close();
			// console.log('=这是加入购物车',res)
			// this.$emit('setToastShow',{
			// 	title: '加入成功',
			// 	duration: 1000
			// })
			this.$parent.setToastShow({
				title: '加入成功',
				duration: 1000
			});
		}
	},
	computed: {
		// 设置显示多少的库存
		actualStock() {
			console.log('组件内的数据',this.commonData)
			// 实际库存
			if(this.commonData.skuStockList) {
				// console.log(this.commonData.skuStockList[this.selectIndex].stock)
				var actualStock = this.commonData.skuStockList[this.selectIndex].stock - this.commonData.skuStockList[this.selectIndex].lockStock
				if(actualStock >= 0) {
					return actualStock
				}
			}
			return 0;
		},
		
		setShowInventory() {
			// if(this.commonData.)
			return 100;
		},
		separateData() {
			var getCommonData = this.commonData
			var maxIndex = 0;
			var maxlength = 0;
			console.log(getCommonData)
			if(!getCommonData.skuStockList){
				 return {}
			}
			// 遍历拿到最长的数组索引
			getCommonData.skuStockList.forEach(function(item, i) {
				var _item = JSON.parse(item.spData)
				if(_item.length > maxlength) {
					maxlength = _item.length
					maxIndex = i
				}
			})
			// console.log('最大索引',maxIndex, maxlength)
			var keys = {}		// 规格对象
			var currentList = []		// 当前选中的规格对象
			var currentIndex = {}		// 当前选中的对象索引
			var spData = JSON.parse(getCommonData.skuStockList[maxIndex].spData)
			spData.forEach((item,i) => {
				keys[item.key] = []
				var currentListObj = {}
				currentListObj.key = item.key
				currentListObj.value = item.value
				currentList.push(currentListObj)
				currentIndex[item.key] = 0
			})
			this.currentData = currentList		// 当前选中的规格对象的结构
			this.separateIndex = currentIndex	// 当前选中的对象索引
			getCommonData.skuStockList.forEach((item, i) => {
				var _item = JSON.parse(item.spData)
				item.index = i
				_item.forEach((item1, i1)=> {
					for(var key  in keys){
						if(item1.key == key) {
							// console.log(item1)
							if(keys[item1.key].indexOf(item1.value) == -1) {
								keys[item1.key].push(item1.value)
							}
						}
					}
				})
			})
			console.log(keys)
			return keys
		}
	},
	filters: {
		setAttr(value) {
			// console.log(value)
			if (value) {
				let arr = JSON.parse(value);
				let str = '';
				arr.forEach(item => {
					str += `${item.value} `;
				});
				return str;
			} else {
				return '正常';
			}
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
<style lang="scss" scoped>
.header {
	padding: 27rpx 30rpx;
	display: flex;
	.header-img-box {
		height: 241rpx;
		width: 230rpx;
		.header-img {
			height: 100%;
			width: 100%;
		}
	}
	.header-text-box {
		padding-left: 16rpx;
		.header-top-text {
			padding-top: 40rpx;
			font-size: 40rpx;
			letter-spacing: 2rpx;
			font-weight: 600;
			color: rgba(250, 4, 4, 1);
		}
		.header-middle-text {
			font-size: 30rpx;
			font-weight: 500;
			color: rgba(153, 153, 153, 1);
			line-height: 50rpx;
		}
		.header-bottom-text {
			font-size: 25rpx;
			font-weight: 400;
			color: rgba(51, 51, 51, 1);
		}
	}
}
.color-title {
	padding-top: 20rpx;
	margin-bottom: 20rpx;
}
.color-select {
	margin: 0 30rpx;
	padding-bottom: 10rpx;
	.color-box {
		max-height: 580rpx;
		min-height: 400rpx;
		display: flex;
	}
	.color-item {
		// display: inline-block;
		// margin: 10rpx 0;
		// margin-right: 25rpx;
		// border-radius: 5rpx;
		// border: 1rpx solid white;
		// background-color: rgba(191, 191, 191, 0.3);
		// position: relative;
		// height: 60rpx;
		.title {
			display: block;
		}
		.color-list-box {
			display: flex;
			flex-wrap: wrap;
			.color-list {
				display: inline-block;
				margin: 10rpx 0;
				margin-right: 25rpx;
				border-radius: 5rpx;
				border: 1rpx solid white;
				background-color: rgba(191, 191, 191, 0.3);
				position: relative;
				height: 60rpx;
			}
			.color-list.active {
				color: white;
				border: 1rpx solid #242424;
				background-color: white;
			}
		}
		.item-image {
			height: 100%;
			width: 54rpx;
		}
		.item-text {
			font-size: 26rpx;
			line-height: 60rpx;
			float: right;
			padding: 0 18rpx;
			color: rgba(51, 51, 51, 1);
		}
	}
}
.item-count {
	margin-top: 10rpx;
	height: 90rpx;
	border-bottom: 1rpx solid rgba(214, 214, 214, 0.6);
	border-top: 1rpx solid rgba(214, 214, 214, 0.6);
	position: relative;
}
.count-title {
	font-size: 30rpx;
	font-weight: 500;
	color: rgba(51, 51, 51, 1);
	line-height: 90rpx;
	display: inline-block;
}
.set-count {
	float: right;
	width: 197rpx;
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	right: 30rpx;
	display: flex;
	justify-content: space-between;
	.set {
		width: 65rpx;
		height: 55rpx;
		background-color: rgba(191, 191, 191, 0.5);
	}
	.add {
		position: relative;
		image {
			height: 3rpx;
			width: 15rpx;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
	}
	.remove {
		position: relative;
		image {
			height: 15rpx;
			width: 15rpx;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
	}
	.count {
		width: 65rpx;
		height: 55rpx;
		font-size: 28rpx;
		line-height: 55rpx;
		text-align: center;
		background-color: rgba(191, 191, 191, 0.5);
	}
}
.cart-buy {
	background: rgba(255, 255, 255, 1);
	box-shadow: 0rpx 0rpx 21rpx 0rpx rgba(119, 119, 119, 0.33);
	padding: 20rpx 30rpx;
	margin-top: 10rpx;
	position: relative;
	z-index: 20;
	.set-buy-btn {
		width: 690rpx;
		height: 90rpx;
		display: flex;
		line-height: 90rpx;
		text-align: center;
		border-radius: 45px;
		font-size: 32rpx;
		color: white;
		overflow: hidden;
	}
	.cart {
		width: 50%;
		// background: rgba(0, 160, 233, 1);
	}
	.buy {
		width: 50%;
		// background: rgba(14, 90, 187, 1);
	}
	.cart-cart {
		width: 100%;
		// background: rgba(0, 160, 233, 1);
	}
	.buy-buy {
		width: 100%;
		// background: rgba(14, 90, 187, 1);
	}
}
</style>
<style lang="scss" scoped>
.min-popup {
	width: 100vw;
	height: 100vh;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 100;
	&.min-hide {
		.min-content {
			animation: hide 0.3s linear forwards;
		}
		.min-overlay {
			opacity: 0;
		}
	}
	&.min-show {
		.min-content {
			animation: show 0.3s linear forwards;
		}
		.min-overlay {
			opacity: 1;
		}
	}
	.min-overlay {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.6);
		z-index: 200;
		transition: 0.5s;
	}
	.min-content {
		width: 100%;
		background: #fff;
		position: absolute;
		left: 0;
		bottom: 0;
		z-index: 300;
		overflow: hidden;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
	}
	.min-content-height {
		width: 100%;
		height: 600rpx;
		background: #fff;
		position: absolute;
		left: 0;
		bottom: 0;
		z-index: 300;
		overflow: hidden;
	}
	@keyframes hide {
		0% {
			transform: translateY(0);
		}
		100% {
			transform: translateY(100%);
		}
	}
	@keyframes show {
		0% {
			transform: translateY(100%);
		}
		100% {
			transform: translateY(0);
		}
	}
}

.closeBtn {
	position: absolute;
	height: 60rpx;
	width: 60rpx;
	top: 27rpx;
	right: 30rpx;
	text-align: center;
	border-radius: 50%;
	font-size: 15rpx;
	image {
		width: 100%;
		height: 100%;
	}
}
</style>
