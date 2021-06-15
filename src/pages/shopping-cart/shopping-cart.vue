<template>
	<view class="shopping-car">
		<hxNavbar :back="false" :fixed="true" title="购物车" color="#ffffff"></hxNavbar>
		<!-- 浮窗弹出 -->
		<tuiModal :show="setModalShow" @click="closeModel" title="提示" content="是否要删除选择内容"></tuiModal>
		<view class="shopping-car-header">
			<view class="shopping-info-left">
				共
				<text>{{ shoppingList.length }}</text>
				件商品
			</view>
			<view class="shopping-info-right" @click="handleEditShopping()">
				<text>{{ editShopping }}</text>
			</view>
		</view>
		<!-- 滑动组件 -->
		<uni-swipe-action>
			<!-- 滚动区域 -->
			<scroll-view scroll-y="true" class="shopping-card-container">
				<!-- 搜索列表显示栏目 -->
				<view class="content-no-text" v-if="!shoppingList[0]">
					<image src="@/static/img/blank.png" mode="" class="content-blank"></image>
					<view class="content-blank-text">购物车为空</view>
				</view>
				<view class="shopping-card" v-for="(shoppingItem, shoppingIndex) in shoppingList" :key="shoppingIndex">
					<view class="shopping-category">
						<view class="shopping-category-radio">
							<radio :value="shoppingItem.shoppingCategoryId" :checked="shoppingItem.shoppingGroupCheck" color="#666666" class="set-radio"
							 @click="handleGroupSelected(shoppingIndex)" />
						</view>
						<view class="shopping-category-text">{{ shoppingItem.shoppingCategory }}</view>
					</view>
					
						<!-- 使用插槽 （请自行给定插槽内容宽度）-->
						<uni-swipe-action-item :autoClose="true">
							<view class="shopping-category-container">
								<view class="shopping-radio-box">
									<radio :value="shoppingItem.shoppingId" color="#666666" :checked="shoppingItem.checkedState" class="shopping-radio"
									 @click="handleSelected(shoppingIndex)" />
								</view>
								<view class="shopping-thuml">
									<image :src="shoppingItem.thumlUrl" mode="scaleToFill"></image>
								</view>
								<view class="shopping-info">
									<view class="shopping-title">{{ shoppingItem.shoppingTitle }}</view>
									<view class="shopping-price">￥{{ shoppingItem.shoppingPrice }}</view>
								</view>
								<view class="acount-btns">
									<view class="acount-btns-left" @click="handleReduceBtn(shoppingIndex)">-</view>
									<view class="acount-btns-middle">{{ shoppingItem.quantity }}</view>
									<view class="acount-btns-right" @click="handleAddBtn(shoppingIndex)">+</view>
								</view>
							</view>
							<template v-slot:right>
								<view class="right-box">
									<view class="Move-Collection" v-if="shoppingItem.isCollection" @click="delCollectPage(shoppingIndex)"><text>移出</text><text>收藏</text></view>
									<view class="Move-Collection" v-else @click="joinCollectPage(shoppingItem, shoppingIndex)"><text>移入</text><text>收藏</text></view>
									<view class="hopping-category-del" @click="hoppingCategoryDel(shoppingItem.id)"><text>删除</text></view>
								</view>
							</template>
						</uni-swipe-action-item>
			
					<!-- <view class="shopping-category-container">	
						<view class="shopping-radio-box">
							<radio :value="shoppingItem.shoppingId" color="#666666" :checked="shoppingItem.checkedState" class="shopping-radio"
							 @click="handleSelected(shoppingIndex)" />
						</view>
						<view class="shopping-thuml">
							<image :src="shoppingItem.thumlUrl" mode="scaleToFill"></image>
						</view>
						<view class="shopping-info">
							<view class="shopping-title">{{ shoppingItem.shoppingTitle }}</view>
							<view class="shopping-price">￥{{ shoppingItem.shoppingPrice }}</view>
						</view>
						<view class="acount-btns">
							<view class="acount-btns-left" @click="handleReduceBtn(shoppingIndex)">-</view>
							<view class="acount-btns-middle">{{ shoppingItem.quantity }}</view>
							<view class="acount-btns-right" @click="handleAddBtn(shoppingIndex)">+</view>
						</view>
					</view> -->
				</view>
			</scroll-view>
			
		</uni-swipe-action>
		<view class="pay-bar">
			<view class="total-price" :class="{ 'delete-price-show': isDeleteShow }">
				合计：
				<text class="shoping-total-price">￥{{ shoppingTotalPrice }}</text>
			</view>
			<view :class="['pay-btn', { 'pay-bar-active': isActive }]" @click="handleConfirmOrder">{{ payBarText }}</view>
			<view :class="['delete-text', { 'delete-text-show': isDeleteShow }, { 'detele-text-active': isDeleteActive }]"
			 @click="handleDeleteShoppingBtn()">删除</view>
		</view>
		<!-- tabBar -->
		<tab-bar :current="2" selectedColor="#333333" color="#999999"></tab-bar>
	</view>
</template>
<script>
	import uniCard from '@/components/uni-card/uni-card.vue';
	import tabBar from '@/components/tabbar/tabbar.vue';
	import {uniSwipeAction} from '@/components/uni-swipe-action/uni-swipe-action.vue';
	import {uniSwipeActionItem} from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue';
	import {
		getShoppingCarList,
		changeShoppingAcount,
		deleteShoppingList
	} from '@/api/shopping-car/shopping-car.js';
	import {
		closeCollerList,
		productDetail,
		isCollet,
		addCollectList,
	} from '@/api/main/main.js';
	import {
		mapMutations,
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				isActive: false,
				setModalShow: false,
				payBarText: '去支付',
				isDeleteShow: false,
				isDeleteActive: false,
				editShopping: '编辑',
				confirmOrder: [],
				shoppingList: [],
				handleDeleteShoppingList: ''
			};
		},
		onLoad: function() {},
		async onShow() {
			// if(!this.$store.state.user.hasLogin){
			if (!this.$store.state.user.hasLogin) {
				if (this.$utils.goLoginPage("../main/login/login")) {
					return;
				}
			} else {
				// 反复请求？
				// if(!this.shoppingList.length){
				// 	this.getShoppingCarListInfo();
				// }
				if (this.shoppingCommonData != null) {
					await this.getShoppingCarListInfo();
					this.isActive = false;
					this.setSelectCommon()
				} else {
					this.getShoppingCarListInfo();
					this.isActive = false;
				}
			}
		},
		components: {
			uniCard,
			tabBar,
			uniSwipeAction,
			uniSwipeActionItem
		},
		methods: {
			...mapMutations(['selectCommonData']),
			// 判断是否被收藏
			async isColler(i) {
				let data = await isCollet(this.shoppingList[i].shoppingId);
				// console.log('这是收藏的信息',data)
				if (data.data.code == 200) {
					if (data.data.data) {
						this.shoppingList[i].isCollection = true;
					} else {
						this.shoppingList[i].isCollection = false;
					}
				}
			},
			// 删除收藏
			async delCollectPage(i) {
				uni.showLoading({
				    title: '正在移出',
					mask: true
				});
				let res =  await closeCollerList([this.shoppingList[i].shoppingId]);
				// console.log('删除数据',res.data)
				if(res.data.code === 200) {
					uni.showToast({
						title: '移出成功',
						icon: 'none',
						duration: 1000
					});
					this.isColler(i);
				}
				uni.hideLoading();
			},
			// 加入收藏
			async joinCollectPage(product, i) {
				uni.showLoading({
				    title: '正在加入',
					mask: true
				});
				// console.log(this.getCommonData.skuStockList[0].pic)
				let data = {
					productId: product.shoppingId,
					productName: product.shoppingTitle,
					productPic: product.thumlUrl,
					productPrice: product.shoppingPrice,
					productSubTitle: product.shoppingSubTitle
				};
				let res = await addCollectList(data);
				// console.log('这是收藏', res.data.code);
				if(res.data.code === 200 ) {
					uni.showToast({
						title: '加入成功',
						duration: 1000
					});
				}
				uni.hideLoading();
				this.isColler(i);
			},
			async getShoppingCarListInfo() {
				let res = await getShoppingCarList();
				let data = res.data.data;
				console.log('请求的购物车列表', data);

				this.shoppingList = [];
				data.forEach((item, index, self) => {
					let getShoppingListItem = {};
					getShoppingListItem.shoppingId = item.productId; //商品ID
					getShoppingListItem.thumlUrl = item.productPic; //商品图片
					getShoppingListItem.shoppingTitle = item.productName; //商品名
					getShoppingListItem.shoppingCategoryId = item.productCategoryId; //商品分类ID
					getShoppingListItem.shoppingCategory = item.productBrand; //商品品牌
					getShoppingListItem.shoppingPrice = item.price; //商品价格
					getShoppingListItem.id = item.id; //购物车本身id
					getShoppingListItem.memberId = item.memberId;
					getShoppingListItem.skuId = item.productSkuId; //商品规格
					getShoppingListItem.quantity = item.quantity; //商品数量
					getShoppingListItem.shoppingSubTitle = item.productSubTitle; //商品二级标题
					getShoppingListItem.memberNickName = item.memberNickName;
					getShoppingListItem.shoppingGroupCheck = false;
					getShoppingListItem.checkedState = false;
					getShoppingListItem.isCollection = false;
					this.shoppingList.unshift(getShoppingListItem);
				});
				this.shoppingList.forEach((item, index, self) => {
					this.isColler(index);
				})
				console.log(this.shoppingList)
			},
			
			// 判断库存是否足够
			async isStock(Selective) {
				console.log('选择的',Selective)
				let needPurchase = {}
				
				for(var i = 0; i< Selective.length; i++) {
					var id = Selective[i].shoppingId
					var {data} = await productDetail(id);
					needPurchase[id] = data.data.skuStockList
				}
				console.log(needPurchase)
				var productInsufficient = {}
				for(var i = 0; i< Selective.length; i++) {
					for(let key  in needPurchase){
						if(key == Selective[i].shoppingId) {
							for(var j = 0; j< needPurchase[key].length; j++) {
								if(needPurchase[key][j].id == Selective[i].id) {
									let product = needPurchase[key][j]
									if(Selective[i].quantity > product.stock - product.lockStock) {
										productInsufficient.N = Selective[i].shoppingTitle
										break;
									}
								}
							}
						}
					}
				}
				if(productInsufficient.N) {
					uni.showModal({
						title: '库存不足',
					    content: productInsufficient.N + " 商品库存不知",
					});
					return false
				}
				return true
			},
			
			// 跳转到订单确认页
			async handleConfirmOrder() {
				let needPurchase = []
				this.confirmOrder = [];
				console.log(this.shoppingList)
				for (let i = 0; i < this.shoppingList.length; i++) {
					if (this.shoppingList[i].checkedState) {
						// let shoppingObj={};
						// shoppingObj.shoppingCatageory=this.shoppingList[i].shoppingCategory;
						// shoppingObj.thumlUrl=this.shoppingList[i].thumlUrl;
						// shoppingObj.shoppingTitle=this.shoppingList[i].shoppingTitle;
						// shoppingObj.shoppingPrice=this.shoppingList[i].shoppingPrice;
						// shoppingObj.quantity=this.shoppingList[i].quantity;
						// this.confirmOrder.unshift(shoppingObj);
						this.confirmOrder.unshift(this.shoppingList[i].id);
						needPurchase.push(this.shoppingList[i])
					}
				}
				// console.log('shjdggsdkhasghkd',this.confirmOrder);
				
				// 判断库存是否足够
				// var Stock = await this.isStock(needPurchase)
				// if(!Stock) return;
				
				if (this.isActive) {
					let obj = {
						arr: this.confirmOrder,
						type: 's'
					};
					// console.log(obj)
					uni.navigateTo({
						url: '/pages/shopping-cart/confirm-order/confirm-order?setConfirmOrder=' + encodeURIComponent(JSON.stringify(
							obj))
					});
				} else {
					uni.showToast({
						icon: 'none',
						title: '未选中商品'
					});
					return;
				}
			},
			// 点击编辑按钮的逻辑
			handleEditShopping() {
				this.isDeleteShow ? (this.editShopping = '编辑') : (this.editShopping = '取消编辑');
				this.isDeleteShow = !this.isDeleteShow;
				for (let i = 0; i < this.shoppingList.length; i++) {
					this.shoppingList[i].checkedState = false;
					this.shoppingList[i].shoppingGroupCheck = false;
				}
				this.isDeleteActive = false;
				this.isActive = false;
			},
			// 点击商品删除按钮
			async handleDeleteShoppingBtn() {
				if(this.isDeleteActive) {
					this.setModalShow = true;
					this.handleDeleteShoppingList = []; //将所选删除的商品保存在数组
					for (let i = 0; i < this.shoppingList.length; i++) {
						if (this.shoppingList[i].checkedState) {
							this.handleDeleteShoppingList.push(JSON.stringify(this.shoppingList[i].id));
						}
					}
				}
				
				// if(handleDeleteShoppingList.length){
				// 	// console.log(handleDeleteShoppingList);
				// 	// uni.showModal({
				// 	// 	title:"确定要删除所选商品吗？",
				// 	// 	success:(res)=>{
				// 	// 		if (res.confirm) {
				// 	// 			console.log(handleDeleteShoppingList);
				// 	// 			this.deleteShoppingList(handleDeleteShoppingList);
				// 	// 		} else if (res.cancel) {

				// 	// 		}
				// 	// 	}
				// 	// })
				// 	// this.closeCollerList()

				// }
			},
			async closeModel(e) {
				// console.log(e)
				if (e.index == 0) {
					this.setModalShow = false;
				} else {
					if (this.handleDeleteShoppingList.length) {
						this.deleteShoppingList(this.handleDeleteShoppingList);
					}
				}
			},
			// 执行商品删除
			async deleteShoppingList(arr) {
				let res = await deleteShoppingList(arr);
				this.getShoppingCarListInfo();
				if (res.statusCode == 200) {
					this.isDeleteActive = false;
					this.setModalShow = false;
				}
			},
			// 切换商品是否选中
			handleSelected(index) {
				this.shoppingList[index].checkedState = !this.shoppingList[index].checkedState;
				for (let i = 0; i < this.shoppingList.length; i++) {
					if (this.shoppingList[i].checkedState === true) {
						this.isActive = true;
						this.isDeleteActive = true;
						break;
					} else {
						this.isActive = false;
						// console.log(this.shoppingList[index].shoppingGroupCheck)
						this.shoppingList[index].shoppingGroupCheck = false;
						this.isDeleteActive = false;
					}
				}
			},
			// 处理从购物车已选中的商品数据
			handleShoppingSelected() {
				for (let i = 0; i < this.shoppingList.length; i++) {
					if (this.shoppingList[i].checkedState) {
						let shoppingObj = {};
						shoppingObj.catageory = this.shoppingList[i].shoppingCategory;
						shoppingObj.thumlUrl = this.shoppingList[i].thumlUrl;
						shoppingObj.shoppingTitle = this.shoppingList[i].shoppingTitle;
						shoppingObj.shoppingPrice = this.shoppingList[i].shoppingPrice;
						shoppingObj.shoppingAcount = this.shoppingList[i].shoppingAcount;
						this.confirmOrder.push(shoppingObj);
					}
				}
			},
			// 点击商品数量增加按钮
			handleAddBtn(index) {
				this.shoppingList[index].quantity++;
				// console.log(this.shoppingList[index].id);
				// console.log(this.shoppingList[index].quantity);
				// 点击获取相对应商品的id名和数量
				this.changeShoppingAcount({
					id: this.shoppingList[index].id,
					quantity: this.shoppingList[index].quantity
				});
			},
			// 滑动删除
			hoppingCategoryDel(id) {
				// console.log(id)	
				this.setModalShow = true;
				this.handleDeleteShoppingList = [];
				this.handleDeleteShoppingList.push(JSON.stringify(id));
			},
			// 执行购物车商品数量修改操作	
			async changeShoppingAcount(obj) {
				let res = await changeShoppingAcount(obj);
			},
			// 点击商品数量较少按钮
			handleReduceBtn(index) {
				this.shoppingList[index].quantity--;
				// 判断商品数量减少到1时，强制等于1
				if (this.shoppingList[index].quantity <= 1) {
					this.shoppingList[index].quantity = 1;
				}
				// 点击获取相对应商品的id名和数量
				this.changeShoppingAcount({
					id: this.shoppingList[index].id,
					quantity: this.shoppingList[index].quantity
				});
			},
			// 全选按钮逻辑
			handleGroupSelected(index) {
				let shoppingGroupId = this.shoppingList[index].shoppingCategoryId; //获取当前商品类别id名
				this.shoppingList.forEach((item, idx, self) => {
					// 通过得到的商品类别id名遍历出数组内包含的相同商品类别id名，进行取反操作
					if (shoppingGroupId === item.shoppingCategoryId) {
						item.shoppingGroupCheck = !item.shoppingGroupCheck;
						item.checkedState = !item.checkedState;
					}
				});
				// 根据商品类别当前的全选选中状态，判断是否进行全选与非全选操作
				if (!this.shoppingList[index].shoppingGroupCheck) {
					this.shoppingList.forEach((item, idx, self) => {
						if (shoppingGroupId === item.shoppingCategoryId) {
							item.shoppingGroupCheck = false;
							item.checkedState = false;
						}
					});
				} else {
					this.shoppingList.forEach((item, idx, self) => {
						if (shoppingGroupId === item.shoppingCategoryId) {
							item.shoppingGroupCheck = true;
							item.checkedState = true;
						}
					});
					
				}
				for (let i = 0; i < this.shoppingList.length; i++) {
					//支付按钮的激活状态与非激活状态设置
					if (this.shoppingList[i].checkedState === true) {
						this.isActive = true;
						this.isDeleteActive = true;
						break; //遍历出有选中的商品，跳出并制止循环
					} else {
						this.isActive = false;
						this.isDeleteActive = false;
					}
				}
			},
			handleTotalPrice() {},
			// 设置勾选逻辑
			setSelectCommon() {
				// console.log(this.shoppingCommonData)
				let id = this.shoppingCommonData.product.id;
				// console.log(this.shoppingList);
				// this.selectCommonData(null)
				this.shoppingList.forEach((item, key) => {
					if (item.shoppingId == id) {
						item.checkedState = true;
						this.$set(this.shoppingList, key, item)
					}
				})
				// console.log(this.shoppingList);
				this.isActive = true;
				this.selectCommonData(null)
			}
		},
		computed: {
			...mapState(['shoppingCommonData']),
			shoppingTotalPrice() {
				let total = 0;

				this.shoppingList.forEach((item, index, self) => {
					if (item.checkedState) {
						total += item.quantity * item.shoppingPrice;
					}
				});
				return total;
			}
		},
	};
</script>
<style>
	.shopping-car ::-webkit-scrollbar {
		width: 0;
		height: 0;
		background-color: transparent;
	}

	scroll-view ::-webkit-scrollbar {
		width: 0;
		height: 0;
		background-color: transparent;
	}
</style>
<style lang="scss">
	.shopping-car {
		width: calc(100vw);
		height: auto;
		padding: 20rpx 0;
		padding-top: 0;
		position: relative;

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

		.shopping-car-header {
			display: flex;
			justify-content: space-between;
			width: 693rpx;
			height: 49rpx;
			margin: 0 auto;
			align-items: center;
			margin-bottom: 10rpx;
			padding: 12rpx 0;

			.shopping-info-left {
				font-size: 30rpx;
				color: #999999;
			}

			.shopping-info-right {
				font-size: 30rpx;
				color: #333333;
			}
		}

		.shopping-card-container {
			width: calc(100vw);
			height: calc(100vh - 414rpx);
			padding-top: 10rpx;
		}

		.shopping-card:nth-child(1) {
			margin-top: 5rpx;
		}

		.shopping-card {
			width: 693rpx;
			// height: 204rpx;
			margin: 0 auto;
			box-shadow: 0 0 10rpx 1rpx rgba(119, 119, 119, 0.15);
			border: 1rpx solid #f7f7f7;
			border-radius: 5rpx;
			margin-bottom: 25rpx;

			.shopping-category {
				display: flex;
				align-items: center;
				height: 60rpx;
				border-bottom: 1rpx solid #dcdcdc;

				.shopping-category-radio {
					height: 100%;
					position: relative;
					width: 60rpx;

					.set-radio {
						position: absolute;
						top: 50%;
						left: 55%;
						transform: translate(-50%, -50%) scale(0.8);
					}
				}

				.shopping-category-text {
					display: inline-block;
					height: 17rpx;
					line-height: 17rpx;
					color: #333333;
					font-size: 18rpx;
					margin-left: -15rpx;
				}
			}

			.shopping-category-container {
				width: auto;
				height: 210rpx;
				display: flex;
				position: relative;

				.shopping-radio-box {
					position: relative;
					height: 100%;
					width: 60rpx;

					.shopping-radio {
						position: absolute;
						top: 50%;
						left: 55%;
						transform: translate(-50%, -50%) scale(0.8);
					}
				}

				.shopping-thuml {
					width: 130rpx;
					height: 100%;

					image {
						width: 130rpx;
						height: 150rpx;
						position: absolute;
						top: 50%;
						transform: translateY(-50%);
					}
				}

				.shopping-info {
					width: 360rpx;
					height: calc(100%-60rpx);
					padding: 30rpx 20rpx;

					.shopping-title {
						// width: 358rpx;
						font-size: 30rpx;
						font-family: PingFang SC;
						font-weight: 500;
						color: rgba(51, 51, 51, 1);
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}

					.shopping-price {
						margin-top: 18rpx;
						color: #fd0101;
						font-size: 30rpx;
					}
				}

				.acount-btns {
					display: flex;
					right: 30rpx;
					position: absolute;
					top: 50%;
					transform: translateY(-50%);

					.acount-btns-left,
					.acount-btns-middle,
					.acount-btns-right {
						width: 60rpx;
						height: 55rpx;
						background: #EEEEEE;
						opacity: 0.58;
						border-radius: 3px;
						font-size: 35rpx;
						text-align: center;
						line-height: 55rpx;
						margin-right: 2rpx;
					}
				}
			}
			.right-box {
				display: flex;
				.hopping-category-del {
					width: 150rpx;
					background: #E33D23;
					color: #FFFFFF;
					height: 100%;
					line-height: 200rpx;
					text-align: center;
				}
				.Move-Collection {
					display: block;
					width: 150rpx;
					background: #FFBA14;
					color: #FFFFFF;
					// height: 100%;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
				}
			}
			
		}
		

		.pay-bar {
			width: calc(100vw);
			height: 95rpx;
			background: rgba(255, 255, 255, 1);
			box-shadow: 0 0 6rpx 0 rgba(119, 119, 119, 0.54);
			position: absolute;
			margin-bottom: constant(safe-area-inset-bottom);
			margin-bottom: env(safe-area-inset-bottom);
			bottom: 100rpx;
			display: flex;
			justify-content: space-between;
			font-size: 30rpx;

			.total-price {
				// width: 200rpx;
				padding-left: 30rpx;
				height: 100%;
				font-size: 32rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
				text-align: center;
				line-height: 95rpx;

				.shoping-total-price {
					color: #fd0101;
				}
			}

			.pay-btn {
				width: 179rpx;
				height: 100%;
				background: #EEEEEE;
				font-size: 36rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #999999;
				text-align: center;
				line-height: 95rpx;
			}

			.delete-text {
				display: none;
				position: absolute;
				right: 0;
				width: 179rpx;
				height: 100%;
				background: rgba(191, 191, 191, 1);
				font-size: 34rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(238, 238, 238, 1);
				text-align: center;
				line-height: 95rpx;
			}

			.delete-text-show {
				display: block;
			}
			.delete-price-show {
				opacity: 0;
			}
			.detele-text-active,
			.pay-bar-active {
				background: rgba(0, 0, 0, 1);
				color: rgba(238, 238, 238, 1);
			}
			.detele-text-active {
				background: #E33D23;
				color: #FFFFFF;
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
	
</style>
