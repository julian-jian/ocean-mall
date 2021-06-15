<template>
	<view>
		<hxNavbar :fixed="true" :title="title" color="#ffffff" />
		<view class="confirm-order">
			<view class="reciver" @click="handleChooseAddress">
				<view class="reciver-info">
					<view class="username-phone">
						<view class="reciver-name">{{ chooseAddress.name }}</view>
						<view class="reciver-phone-number">{{ chooseAddress.phoneNumber }}</view>
					</view>

					<view class="reciver-address">{{ chooseAddress.allAddress }}</view>
				</view>
				<view class="arrow-right">
					<uni-icons type="arrowright" size="10"></uni-icons>
				</view>
			</view>

			<scroll-view scroll-y="true" class="shopping-card-container">
				<view class="shopping-card" v-for="(shoppingItem, shoppingIndex) in shoppingListInfo" :key="shoppingIndex">
					<view class="shopping-category-container">
						<view class="shopping-thuml">
							<image :src="shoppingItem.thumlUrl" mode="scaleToFill"></image>
						</view>
						<view class="shopping-info">
							<view class="shopping-title">{{ shoppingItem.shoppingTitle }}</view>
							<view class="shopping-price">{{ orderMark }}{{ shoppingItem.shoppingPrice }}</view>
						</view>
						<view class="acount-btns">x{{ shoppingItem.quantity }}</view>
					</view>
				</view>
				<view class="order-info" :style="{ height: '300rpx' }">
					<view class="shopping-total-price">
						<view class="total-price-left">{{ shoppingPayText }}</view>
						<view class="total-price-right">{{ orderMark }}{{ totalPrice }}</view>
					</view>
					<view class="postage-fare">
						<view class="postage-fare-left">总重量</view>
						<view class="postage-fare-right">{{productWeight}} Kg</view>
					</view>
					<view class="postage-fare" v-if="orderMark !== '积分 '">
						<view class="postage-fare-left">邮费</view>
						<view class="postage-fare-right">{{postage ? ('￥' +postage): '包邮'}}</view>
					</view>
					<view class="get-intergral">
						<view class="get-intergral-left">获得积分</view>
						<view class="get-intergral-right total-price-right">{{ totalPoint || 0 }}</view>
					</view>
					<view class="consumer-intergral">
						<view class="consumer-intergral-left">消费积分</view>
						<view class="consumer-intergral-right total-price-right">{{ consumerIntergral || 0 }}</view>
					</view>
				</view>
			</scroll-view>
			<!-- <view class="unpaid-container" v-if="paidPageShow">
				<view class="unpaid-bar">
					<view class="countdown">
						<text>请在{{ countdown }}内支付</text>
						<view class="close-icon" @click="handleClosePaid"><uni-icons type="close" size="20"></uni-icons></view>
					</view>
					<view class="countdown-bar"></view>
					<view class="user-address" @click="handleChooseAddress">
						<view class="address-icon"><image src="/static/img/site-delete.png" mode="widthFix"></image></view>
						<view class="address-text">{{ chooseAddress.allAddress }}</view>
						<view class="arrow-right"><uni-icons type="arrowright" size="20"></uni-icons></view>
					</view>
					<view class="countdown-bar"></view>
					<view class="paid-type-container">
						<view class="paid-type">
							<view class="paid-type-icon"><image src="/static/img/back-search.png" mode="widthFix"></image></view>
							<view class="paid-type-text">{{ paidType }}</view>
						</view>
					</view>
					<view class="paid-bar-bottom" @click="handlePaid">{{ paid }}</view>
				</view>
			</view> -->

			<view class="pay-bar">
				<view class="total-price" v-if="!paidPageShow">
					合计：
					<text class="shoping-total-price">{{ orderMark }}{{ orderMark === '积分 '?totalPrice: totalPrice + postage}}</text>
				</view>
				<view class="total-price" v-if="paidPageShow">
					合计：
					<text class="shoping-total-price">{{ orderMark }}{{ totalPrice }}</text>
				</view>
				<view class="pay-btn" @click="handleOrderDetail" v-if="!paidPageShow">去支付</view>
				<view class="pay-btn" @click="handlePaid" v-if="paidPageShow">去支付</view>
				<view :class="['exchange-btn', { 'exchange-btn-show': exchangeBtnIsShow }]" @click="handleExchange">去兑换</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniIcons from '@/components/ocean-icon/m-icon.vue';
	import {
		getAddressList
	} from '@/api/user/address.js';
	import {
		exchange
	} from '@/api/shopping-car/exchange/exchanges.js';
	import {
		addShoppingToConfirmOrder,
		shoppingOrder,
		createProductOrder,
		goToPay
	} from '@/api/shopping-car/shopping-car.js';
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				orderType: '',
				orderMark: '',
				title: '订单确认',
				paidPageShow: false,
				countdown: '23:00',
				paidType: '微信支付',
				paid: '去付款',
				exchangeBtnIsShow: false,
				shoppingPayText: '商品总价',
				shoppingListInfo: [],
				shoppingId: '',
				chooseAddress: {
					name: '收货人',
					phoneNumber: '手机号码',
					allAddress: '收货地址'
				}, //收货信息初始化
				// province: 
				exchangeInfo: '',
				buyShoppingData: '', //商品直接购买的商品数据
				buyShoppingSkuData: '', //商品直接购买的商品的规格
				calcAmount: '', //付款信息
				commonData: {}, //从积分兑换页跳转所携带的积分兑换接收的信息
				exchangeSuccessInfoArr: [], //用于保存下单成功后生成的订单信息的每一项，包含商品名，商品规格等
				// exchangeDetailInfoArr:[],//用于保存订单信息，包括订单编号，下单时间等，支付方式
				// 设置购物车的页面和数据
				shoppingCartData: {},
				shoppCartBuyData: {},
				shoppingCommonData: {},
				totalPoint: '',
				totalPrice: '',
				consumerIntergral: '',
				nonoPayData: {},
				productWeight: 0,  	// 商品重量
			};
		},
		async onLoad(data) {
			// 从订单确认页获取的参数
			// 判断购物车购买
			// console.log('页面参数',data);
			// 未付款数据处理
			if (data.noPayment) {
				// console.log('==============================',orderItemList)
				this.paidPageShow = true;
				this.title = '未付款';
				let unpayData = JSON.parse(decodeURIComponent(data.noPayment));
				console.log('This is my', unpayData);
				let orderItemList = unpayData.orderItemList;
				this.nonoPayData = unpayData;
				console.log('这是未付款调换的页面', this.nonoPayData);
				this.orderMark = '￥';
				orderItemList.forEach((item, index, self) => {
					let exchangeShoppingInfo = {};
					exchangeShoppingInfo.thumlUrl = item.productPic;
					exchangeShoppingInfo.shoppingTitle = item.productName;
					exchangeShoppingInfo.quantity = item.productQuantity;
					exchangeShoppingInfo.shoppingPrice = item.productPrice;
					exchangeShoppingInfo.shoppingCatageory = item.productName;
					exchangeShoppingInfo.productCategoryId = item.productCategoryId;
					exchangeShoppingInfo.id = item.id;
					exchangeShoppingInfo.giftPoint = item.giftIntegration;
					exchangeShoppingInfo.productAttr = item.productAttr;
					exchangeShoppingInfo.productId = item.productId;
					exchangeShoppingInfo.orderId = item.orderId;
					exchangeShoppingInfo.orderSn = item.orderSn;
					this.shoppingListInfo.unshift(exchangeShoppingInfo);
				});
				this.productWeight = unpayData.totalWeight && unpayData.totalWeight!== 'null'? unpayData.totalWeight / 1000: 0;  // 总重量
				this.totalPrice = unpayData.payAmount; //未付款的总价格
				this.totalPoint = unpayData.integration; //未付款购买获得的总积分数
			}
			// 购物车传过来的数据
			if (data.setConfirmOrder) {
				// console.log('=================+++=======',orderItemList)
				// 获取数据
				this.paidPageShow = false;
				this.title = '订单确认';
				this.orderMark = '￥';
				let myObj = JSON.parse(decodeURIComponent(data.setConfirmOrder));
				this.shoppingCartData = myObj;
				console.log('购物车数据',this.shoppingCartData);
				this.setshoppCartBuyData();
				// console.log('This is 购物车');
			}
			// 从积分兑换页或商品购买页传过来的数据
			if (data.data) {
				console.log()
				// console.log('==============--------========',orderItemList)
				this.paidPageShow = false;
				this.title = '订单确认';
				this.commonData = JSON.parse(decodeURIComponent(data.data));
				// console.log('look me',this.commonData);
				let obj = JSON.parse(decodeURIComponent(data.data));
				// this.shoppingCommonData=obj;
				let exchangeShoppingInfo = {};
				console.log('This is gou ma jifen', obj);
				// 判断购买类型是否为2,2类型为积分兑换
				if (obj.buyType == 2) {
					this.orderType = '积分兑换';
					this.orderMark = '积分 ';
					this.exchangeBtnIsShow = true;
					this.shoppingPayText = '商品积分';
					this.totalPrice = obj.skuStock.points;
					// this.exchangeInfo=obj.data;
					this.consumerIntergral = obj.skuStock.points; //消费积分数
					exchangeShoppingInfo.shoppingPrice = obj.skuStock.points; //商品的积分数
				} else if (obj.buyType < 2) {
					// console.log("这是购买页跳转的")
					console.log('购买页', this.commonData);
					this.orderType = '购买';
					this.orderMark = '￥';
					this.totalPrice = obj.skuStock.price * obj.CommonCount; //商品总价
					this.totalPoint = obj.skuStock.giftPoints * obj.CommonCount; //商品获得总积分
					this.productWeight = obj.skuStock.weight  &&  obj.skuStock.weight!== 'null'? obj.skuStock.weight / 1000:0;		// 商品的重量
					// this.consumerIntergral=obj.data.giftPoint*obj.CommonCount;//获得的消费积分数
					exchangeShoppingInfo.quantity = obj.data.CommonCount;
					exchangeShoppingInfo.shoppingPrice = obj.skuStock.price;
					// console.log('Thisis dsadas',obj)
				}	
				exchangeShoppingInfo.thumlUrl = obj.skuStock.pic;
				exchangeShoppingInfo.shoppingTitle = obj.data.name;
				exchangeShoppingInfo.quantity = obj.CommonCount;
				exchangeShoppingInfo.shoppingCatageory = obj.data.productCategoryName;
				exchangeShoppingInfo.productCategoryId = obj.data.productCategoryId;
				exchangeShoppingInfo.id = obj.data.id;
				exchangeShoppingInfo.giftPoint = obj.skuStock.giftPoints;
				this.shoppingListInfo.unshift(exchangeShoppingInfo);
			}
		},
		onShow: function() {
			this.handleGetAddress();
		},
		onReady: function() {},
		components: {
			uniIcons
		},
		methods: {
			...mapMutations(['setClickBoolean']),
			// 购物车传的数据
			async setshoppCartBuyData() {
				let data = await addShoppingToConfirmOrder(this.shoppingCartData.arr);
				this.shoppCartBuyData = data;
				console.log('look', this.shoppCartBuyData);
				let shoppingListData = this.shoppCartBuyData.data.data.cartPromotionItemList;
				console.log(shoppingListData);
				shoppingListData.forEach((item, index, self) => {
					let exchangeShoppingInfo = {};
					exchangeShoppingInfo.thumlUrl = item.productPic;
					exchangeShoppingInfo.shoppingTitle = item.productName;
					exchangeShoppingInfo.quantity = item.quantity;
					exchangeShoppingInfo.shoppingPrice = item.price;
					exchangeShoppingInfo.shoppingCatageory = item.productName;
					exchangeShoppingInfo.productCategoryId = item.productCategoryId;
					exchangeShoppingInfo.id = item.id;
					exchangeShoppingInfo.giftPoint = item.giftIntegration;
					exchangeShoppingInfo.productAttr = item.productAttr;
					exchangeShoppingInfo.productId = item.productId;
					exchangeShoppingInfo.orderId = item.orderId;
					exchangeShoppingInfo.orderSn = item.orderSn;
					this.shoppingListInfo.unshift(exchangeShoppingInfo);
				});
				this.totalPrice = this.shoppCartBuyData.data.data.calcAmount.payAmount;
				this.totalPoint = this.shoppCartBuyData.data.data.totalPoint; //下单后获得总积分数
				this.productWeight = data.data.data.totalWeight? data.data.data.totalWeight / 1000: 0;   // 商品总重量
				console.log('总重量', this.productWeight)
			},

			// 获取收货地址
			async handleGetAddress() {
				let res = await getAddressList();
				// console.log('This is dizhi',res.data.data);
				let addressArr = res.data.data;
				addressArr.forEach((item, index, self) => {
					// 选择默认的收货地址作为收货地址，defaultStatus状态为1时为默认地址
					if (item.defaultStatus) {
						this.chooseAddress = {};
						this.chooseAddress.id = item.id;
						this.chooseAddress.memberId = item.memberId;
						this.chooseAddress.name = item.name;
						this.chooseAddress.phoneNumber = item.phoneNumber;
						this.chooseAddress.province = item.province;
						this.chooseAddress.city = item.city;
						this.chooseAddress.region = item.region;
						this.chooseAddress.detailAddress = item.detailAddress;
						this.chooseAddress.allAddress = item.province + item.city + item.region + item.detailAddress;
						return this.chooseAddress;
					}
				});
				// console.log(this.chooseAddress);
			},
 			// 跳转到选择地址页
			handleChooseAddress() {
				uni.navigateTo({
					url: '/pages/user/site/site'
				});
			},
			// 付款
			async handleOrderDetail() {
				if (this.clickBoolean) {
					if (!this.chooseAddress.id) {
						uni.showToast({
							title: '地址不能为空',
							duration: 1000,
							icon: 'none'
						});
						return;
					}

					// 商品页直接购买
					if (this.commonData.data) {
						console.log('执行')
						let obj = {};
						obj.price = this.commonData.skuStock.price;
						obj.productAttr = this.commonData.skuStock.spData;
						obj.productBrand = this.commonData.data.brandName;
						obj.productCategoryId = this.commonData.data.productCategoryId;
						obj.productId = this.commonData.data.id;
						obj.productName = this.commonData.data.name;
						obj.productPic = this.commonData.skuStock.pic;
						obj.productSkuCode = this.commonData.skuStock.skuCode;
						obj.productSkuId = this.commonData.skuStock.id;
						obj.productSn = this.commonData.data.productSn;
						obj.productSubTitle = this.commonData.data.subTitle;
						obj.quantity = this.commonData.CommonCount;
						obj.memberReceiveAddressId = this.chooseAddress.id;
						this.orderType === '积分兑换' ? (obj.payType = 1) : (obj.payType = 2); //1为微信兑换，2为微信支付
						obj.useIntegration = this.commonData.data.usePointLimit;
						obj.totalWeight = this.productWeight * 1000;   // 商品重量
						obj.freightAmount = this.postage;		// 邮费
						console.log('重量',this.postage,obj)
						let res = await createProductOrder(obj);
						// console.log('look me this ',res)
						if (res.statusCode == 200) {
							if (res.data.code == 200) {
								console.log('成功')
								// let obj=res.data.data.appObject
								this.$utils.payMent(res, () => {
									// console.log(res.data.data)
									let exchangeOrderInfo = res.data.data.orderItemList; //获取订单详情信息，包含商品名，规格，id
									let exchangeOrderDetail = res.data.data.order; //获取订单详情信息，包含收货地址
									let payType = res.data.data.payType;
									exchangeOrderInfo.forEach((item, index, self) => {
										this.exchangeSuccessInfoArr.unshift(item); //向数组添加并保存订单信息
									});
									// console.log("购买页订单详情信息",this.exchangeSuccessInfoArr);
									uni.navigateTo({
										url: '/pages/shopping-cart/order-detail/order-detail?orderDetail=' +
											encodeURIComponent(JSON.stringify(this.exchangeSuccessInfoArr)) +
											'&orderDetailAddress=' +
											encodeURIComponent(JSON.stringify(exchangeOrderDetail)) +
											'&payType=' +
											payType
									});
								});
							} else {
								console.log('失败')
								uni.showToast({
									icon: 'none',
									title: res.data.message
								});
							}
						}
					}

					// 购物车购买
					if (this.shoppingCartData.arr) {
						// console.log('进到这里')
						let obj = {};
						obj.cartIds = this.shoppingCartData.arr;
						obj.memberReceiveAddressId = this.chooseAddress.id;
						obj.payType = 2;
						obj.freightAmount = this.postage;
						obj.totalWeight = this.productWeight * 1000;   // 商品重量
						this.orderMark = '￥';
						let res = await shoppingOrder(obj);
						// console.log("下单成功购物车订单列表",res)
						if (res.statusCode == 200) {
							if (res.data.code == 200) {
								// console.log('这是购物车',res)
								// return
								this.$utils.payMent(res, () => {
									let exchangeOrderInfo = res.data.data.orderItemList; //获取订单详情信息，包含商品名，规格，id
									let exchangeOrderDetail = res.data.data.order; //获取订单详情信息，包含收货地址
									let payType = res.data.data.order.payType;
									exchangeOrderInfo.forEach((item, index, self) => {
										this.exchangeSuccessInfoArr.unshift(item); //向数组添加并保存订单信息
									});
									// console.log("购物车购买订单信息",this.exchangeSuccessInfoArr);
									// console.log('这是购物车的接口',res.data.data)
									// return
									// let obj = res.data.data.appObject
									// 设置支付
									uni.navigateTo({
										url: '/pages/shopping-cart/order-detail/order-detail?orderDetail=' +
											encodeURIComponent(JSON.stringify(this.exchangeSuccessInfoArr)) +
											'&orderDetailAddress=' +
											encodeURIComponent(JSON.stringify(exchangeOrderDetail)) +
											'&payType=' +
											payType
									});
								});
							} else {
								uni.showToast({
									title: data.data.message
								});
							}
						}
					}
					this.setClickBoolean(false)
					//设置延时
					setTimeout(() => {
						this.setClickBoolean(true)
					}, 2000)
				}
			},
			handleClosePaid() {
				this.paidPageShow = false;
				uni.navigateBack({
					delta: 1
				});
			},
			async handlePaid() {
				//未付款支付
				if (this.nonoPayData.id) {
					let res = await goToPay(this.nonoPayData.id);
					// console.log("这是点击未付款支付",res);
					// return
					this.$utils.payMent(res, () => {
						// console.log(res.data.data)
						let exchangeOrderInfo = res.data.data.orderItemList; //获取订单详情信息，包含商品名，规格，id
						let exchangeOrderDetail = res.data.data.order; //获取订单详情信息，包含收货地址
						let payType = res.data.data.payType;
						exchangeOrderInfo.forEach((item, index, self) => {
							this.exchangeSuccessInfoArr.unshift(item); //向数组添加并保存订单信息
						});
						// console.log("购买页订单详情信息",this.exchangeSuccessInfoArr);
						console.log('这是购物车跳转')
						uni.navigateTo({
							url: '/pages/shopping-cart/order-detail/order-detail?orderDetail=' +
								encodeURIComponent(JSON.stringify(this.exchangeSuccessInfoArr)) +
								'&orderDetailAddress=' +
								encodeURIComponent(JSON.stringify(exchangeOrderDetail)) +
								'&payType=' +
								payType
						});
					});
				}
			},
			// 通过购物车信息下单生成的订单信息
			async addShoppingToConfirmOrder(arr) {
				let res = await addShoppingToConfirmOrder(arr);
				console.log('购物车下单生成的订单信息', res);
				let shoppingToConfirmList = res.data.data.cartPromotionItemList;
				this.calcAmount = res.data.data.calcAmount;
				shoppingToConfirmList.forEach((item, index, self) => {
					let shoppingObj = {};
					shoppingObj.id = item.id;
					shoppingObj.shoppingPrice = item.price;
					shoppingObj.shoppingTitle = item.productName;
					shoppingObj.productAttr = item.productAttr;
					shoppingObj.thumlUrl = item.productPic;
					shoppingObj.productSkuCode = item.productSkuCode;
					shoppingObj.productSkuId = item.productSkuId;
					shoppingObj.quantity = item.quantity;
					shoppingObj.productId = item.productId;
					this.shoppingListInfo.unshift(shoppingObj);
				});
			},
			// 积分兑换
			async handleExchange() {
				if (!this.chooseAddress.id) {
					uni.showToast({
						title: '地址不能为空',
						duration: 1000,
						icon: 'none'
					});
					return;
				}
				let obj = {};
				// obj.price=this.commonData.data.price;
				obj.productAttr = this.commonData.skuStock.spData;
				obj.productBrand = this.commonData.data.brandName;
				obj.productCategoryId = this.commonData.data.productCategoryId;
				obj.productId = this.commonData.data.id;
				obj.productName = this.commonData.data.name;
				obj.productPic = this.commonData.skuStock.pic;
				obj.productSkuCode = this.commonData.skuStock.skuCode;
				obj.productSkuId = this.commonData.skuStock.id;
				obj.productSn = this.commonData.data.productSn;
				obj.productSubTitle = this.commonData.data.subTitle;
				obj.quantity = this.commonData.CommonCount;
				obj.memberReceiveAddressId = this.chooseAddress.id;
				this.orderType === '积分兑换' ? (obj.payType = 1) : (obj.payType = 2); //1为微信兑换，2为微信支付
				obj.useIntegration = this.commonData.skuStock.points;
				// console.log('兑换',obj)
				// return
				let res = await exchange(obj);
				console.log(res);
				if (res.statusCode === 200) {
					if (res.data.code === 200) {
						let exchangeOrderInfo = res.data.data.orderItemList; //获取订单详情信息，包含商品名，规格，id
						let exchangeOrderDetail = res.data.data.order; //获取订单详情信息，包含收货地址
						let payType = res.data.data.payType;
						exchangeOrderInfo.forEach((item, index, self) => {
							this.exchangeSuccessInfoArr.unshift(item); //向数组添加并保存订单信息
						});
						console.log(this.exchangeSuccessInfoArr);
						uni.navigateTo({
							url: '/pages/shopping-cart/order-detail/order-detail?orderDetail=' +
								encodeURIComponent(JSON.stringify(this.exchangeSuccessInfoArr)) +
								'&orderDetailAddress=' +
								encodeURIComponent(JSON.stringify(exchangeOrderDetail)) +
								'&payType=' +
								payType
						});
					} else {
						uni.showToast({
							icon: 'none',
							title: res.data.message
						});
					}
				}
			}
		},
		computed: {
			...mapState(['clickBoolean']),
			// 订单信息中的商品总价或总积分
			shoppingListInfoPrice() {
				let total = 0;
				this.shoppingListInfo.forEach((item, index, self) => {
					total += item.shoppingPrice * item.quantity;
				});
				return total;
			},
			// 邮费计算
			postage() {
				let weight = Math.ceil(this.productWeight);
				// let weight = this.productWeight;
				console.log('重新计算',this.chooseAddress.province, weight)
				if (weight === 0) {
					return 0;
				}
				if(this.chooseAddress.province == '广东省') {
					// 省内  首重12元/KG  续重2元/KG
					return (weight * 2) + 12 - 2;
				} else {
					// 省外  首重20元/KG  续重14元/KG
					return (weight * 14) + 20 - 14;
				}
				// let arr = ['江苏省','浙江省','上海市','北京市','福建省']
				// if(arr.indexOf(this.chooseAddress.province) !== -1) {
				// 	// 首重22元/KG、续重13元/KG。
				// 	return (1 * 2 * 13 )+ 22 - 13;
				// }
				// arr = ['天津市','重庆市','安徽省','广西壮族自治区','贵州省','海南省','河北省','河南省','湖北省','湖南省','江西省','山东省','山西省','陕西省','四川省','云南省']
				// if(arr.indexOf(this.chooseAddress.province) !== -1) {
				// 	// 首重22元/KG、续重14元每/KG
				// 	return (1 * 2 * 14) + 22 - 14;
				// }
				// arr = ['甘肃省','黑龙江省','吉林省','辽宁省','内蒙古自治区','宁夏回族自治区','青海省','西藏自治区','新疆维吾尔自治区']
				// if(arr.indexOf(this.chooseAddress.province) !== -1) {
				// 	// 首重22元/KG、续重18元/KG
				// 	return (1 * 2 * 18) + 22 - 18;
				// }
				// arr = ['香港特别行政区','澳门特别行政区','台湾省']
				// if(arr.indexOf(this.chooseAddress.province) !== -1) {
				// 	// 首重30元/KG、续重20元/KG
				// 	return (1 * 2 * 20) + 30 - 20;
				// }
				// return (1 * 2 * 14) + 22 - 14;
			},
		}
	};
</script>

<style lang="scss">
	scroll-view ::-webkit-scrollbar {
		width: 0;
		height: 0;
		background-color: transparent;
	}

	.confirm-order {
		width: 100vw;
		height: auto;
		// padding: 20rpx 28rpx;
		position: relative;

		.reciver {
			width: 693rpx;
			height: 150rpx;
			background: rgba(255, 255, 255, 1);
			box-shadow: 0 0 10rpx 1rpx rgba(119, 119, 119, 0.15);
			border-radius: 5rpx;
			display: flex;
			justify-content: space-between;
			margin: 0 auto;
			margin-top: 15rpx;
			margin-bottom: 12rpx;
			position: relative;

			// border: 1rpx solid #e8e8e8;
			.reciver-info {
				width: 100%;
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: space-evenly;

				// box-shadow: 0rpx 0rpx 13rpx 0rpx rgba(119, 119, 119, 0.2);
				.username-phone {
					display: flex;
					flex-direction: row;

					.reciver-name,
					.reciver-phone-number {
						margin-left: 24rpx;
						// height:18rpx;
						font-size: 30rpx;
						// line-height: 18rpx;
						font-family: PingFang SC;
						font-weight: 400;
						color: rgba(51, 51, 51, 1);
					}
				}

				.reciver-address {
					margin-left: 20rpx;
					// height:14rpx;
					font-size: 30rpx;
					// line-height: 14rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: rgba(51, 51, 51, 1);
				}
			}

			.arrow-right {
				// transform: scale(0.6);
				// margin-top: 20rpx;
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				right: 10rpx;
			}
		}

		.shopping-card-container {
			width: 100vw;
			position: relative;
			// padding: 10rpx 0;
			// border: 1rpx solid #e8e8e8;
			height: calc(100vh - 320rpx);

			.shopping-card {
				width: 690rpx;
				box-shadow: 0 0 10rpx 1rpx rgba(119, 119, 119, 0.15);
				border-radius: 5rpx;
				margin-bottom: 23rpx;
				position: relative;
				left: 50%;
				transform: translateX(-50%);
				margin-top: 10rpx;

				// border: 1rpx solid #e8e8e8;
				.shopping-category {
					display: flex;
					align-items: center;
					height: 38rpx;
					border-bottom: 1rpx solid #dcdcdc;

					& .shopping-category-text {
						display: inline-block;
						height: 17rpx;
						line-height: 17rpx;
						color: #333333;
						font-size: 18rpx;
						margin-left: 25rpx;
					}
				}

				.shopping-category-container {
					width: auto;
					height: 165rpx;
					display: flex;
					position: relative;

					.category-check {
						display: inline-block;
						width: 17rpx;
						height: 17rpx;
						margin: 0 11rpx;
						border-radius: 50%;
						border: 1rpx solid #1b1b1b;
						position: relative;
						top: 50%;
						margin-top: -8rpx;

						& image {
							width: 100%;
							height: 100%;
							display: block;
						}
					}

					.shopping-thuml {
						width: 113rpx;
						height: 125rpx;

						margin-top: 13rpx;
						margin-right: 28rpx;
						margin-left: 25rpx;

						& image {
							width: 100%;
							height: 100%;
							display: block;
						}
					}

					.shopping-info {
						width: 360rpx;
						height: 100%;
						margin-top: 23rpx;

						.shopping-title {
							width: 358rpx;
							// height: 24rpx;
							// line-height: 24rpx;
							font-size: 30rpx;
							font-family: PingFang SC;
							font-weight: 500;
							color: rgba(51, 51, 51, 1);
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}

						.shopping-price {
							margin-top: 50rpx;
							color: #fd0101;
							font-size: 30rpx;
						}
					}

					.acount-btns {
						// width:18rpx;
						// height:14rpx;
						font-size: 30rpx;
						position: absolute;
						right: 20rpx;
						bottom: 20rpx;
						font-family: PingFang SC;
						font-weight: 500;
						color: rgba(102, 102, 102, 1);
					}
				}
			}

			.order-info {
				position: relative;
				left: 50%;
				transform: translateX(-50%);
				width: 690rpx;
				background: rgba(255, 255, 255, 1);
				box-shadow: 0 0 10rpx 1rpx rgba(119, 119, 119, 0.15);
				border-radius: 5rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-around;

				// border: 1rpx solid #e8e8e8;
				.shopping-total-price,
				.postage-fare,
				.get-intergral,
				.consumer-intergral {
					display: flex;
					justify-content: space-between;

					.total-price-left,
					.postage-fare-left,
					.get-intergral-left,
					.consumer-intergral-left {
						font-size: 30rpx;
						font-family: PingFang SC;
						font-weight: 500;
						color: rgba(51, 51, 51, 1);
						margin-left: 18rpx;
					}

					.total-price-right,
					.postage-fare-right {
						// height:19rpx;
						font-size: 30rpx;
						font-family: PingFang SC;
						font-weight: 500;
						color: rgba(253, 1, 1, 1);
						text-align: right;
						padding-right: 18rpx;
					}
				}
			}
		}

		.unpaid-container {
			width: calc(100vw);
			height: calc(100vh);
			position: fixed;
			top: 0;
			left: 0;
			background: rgba(0, 0, 0, 0.3);
			z-index: 100;

			.unpaid-bar {
				width: calc(100vw);
				height: 698rpx;
				background: rgba(255, 255, 255, 1);
				position: absolute;
				left: 0;
				bottom: 0;

				z-index: 100;

				.countdown {
					width: 100%;
					height: 90rpx;
					text-align: center;
					line-height: 90rpx;
					font-size: 36rpx;
					color: #333333;
				}

				.close-icon {
					position: absolute;
					right: 30rpx;
					top: 0;
				}

				.countdown-bar {
					width: 100%;
					height: 5rpx;
					background: rgba(153, 153, 153, 1);
					opacity: 0.32;
				}

				.user-address {
					width: auto;
					height: 83rpx;

					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 0 29rpx;

					.address-icon {
						width: 32rpx;
						height: 41rpx;

						& image {
							display: block;
							width: 100%;
							height: auto;
						}
					}

					.address-text {
						width: 563rpx;
						height: auto;
						text-align: left;
						font-size: 36rpx;
						font-family: PingFang SC;
						font-weight: 500;
						color: rgba(51, 51, 51, 1);

						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}

				.paid-type-container {
					width: calc(100vw);

					height: auto;

					.paid-type {
						width: auto;
						height: auto;

						display: flex;
						flex-direction: row;
						padding: 0 28rpx;
						margin-top: 50rpx;

						.paid-type-icon {
							width: 52rpx;
							height: 51rpx;
							margin-right: 16rpx;

							& image {
								display: block;
								width: 100%;
								height: auto;
							}
						}
					}
				}

				.paid-bar-bottom {
					width: calc(100vw);
					height: 98rpx;
					background: rgba(0, 0, 0, 1);
					color: rgba(255, 255, 255, 1);
					text-align: center;
					font-family: PingFang SC;
					font-weight: 500;
					font-size: 48rpx;
					line-height: 98rpx;
					position: absolute;
					bottom: 0;
				}
			}
		}

		.pay-bar {
			width: 100vw;
			height: 95rpx;
			background: rgba(255, 255, 255, 1);
			box-shadow: 0 0 10rpx 1rpx rgba(119, 119, 119, 0.15);

			position: fixed;
			// margin-left: -26rpx;
			bottom: 0;
			display: flex;
			justify-content: space-between;

			.total-price {
				// width:200rpx;
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
				height: 95rpx;
				background: rgba(0, 0, 0, 1);
				font-size: 32rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(238, 238, 238, 1);
				text-align: center;
				line-height: 95rpx;
			}

			.exchange-btn {
				display: none;
				position: absolute;
				right: 0;
				width: 179rpx;
				height: 95rpx;
				background: rgba(0, 0, 0, 1);
				font-size: 30rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(238, 238, 238, 1);
				text-align: center;
				line-height: 95rpx;
			}

			.exchange-btn-show {
				display: block;
			}
		}
	}
</style>
