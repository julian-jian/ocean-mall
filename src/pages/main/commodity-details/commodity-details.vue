<template>
	<view class="ocean-box">
	
		<!-- 头部 -->
		<hxNavbar :fixed="true" :leftSlot="true" color="#ffffff" curToHome="../main">
			<view slot="left" class="title-text">{{ getCommonData.product.name | setCommonName }}</view>
		</hxNavbar>
		<scroll-view class="common-details" :scroll-y="true" v-if="getCommonData">
			<!-- banner -->
			<view class="common-banner">
				<swiper :indicator-dots="true" :interval="3000" :duration="1000" class="one" :circular="true"
				 indicator-active-color="#FFFFFF" indicator-color="rgba(153, 153, 153, 1)" @change="changeSwiper">
					<swiper-item class="two" v-for="(item, key) in setBannerImg" :key="key" @click="handleFullImage(item, key)"
					 :item-id="item">
						<view class="swiper-item three">
							<image :src="item" mode="aspectFill" v-if="item.indexOf('mp4') == -1"></image>
							<video :src="item" mode="" id="swiper-video-detail" v-if="item.indexOf('mp4') > -1"></video>
						</view>
					</swiper-item>
				</swiper>
			</view>
			<!-- 标题 -->
			<view class="common-title-box">
				<view class="title-box">
					<view class="common-title">
						<text class="common-title-text">{{ getCommonData.product.name }}</text>
					</view>
					<!-- <view class="common-price-row"> -->
						<view class="common-price" v-if="setCommonData.hotType != 2 && getCommonData.product.price">
							<text class="common-price-icon">￥</text>
							<text class="common-price-text">{{ (getCommonData.product.price + '').split('.')[0] }}</text>
							<text class="common-price-last">.{{ (getCommonData.product.price + '').split('.')[1] || '00' }}</text>
							<text class="common-history">总销量 {{ getCommonData.product.sale }} 件</text>
							<!-- 分享 -->
							<view class="share">
								<view class="fixedIcon" @click="isShareBox = true;isPopupShare = true">
									<view class="icon">
										<image class="img" src="/static/img/iconShare.png"></image>
									</view>
									<text class="text">分享</text>
								</view>
							</view>
						<!-- </view> -->
					</view>
					<view class="common-price" v-if="setCommonData.hotType == 2 && getCommonData.product.usePointLimit">
						<text class="common-price-text">积分{{ getCommonData.skuStockList[selectIndex].points ? getCommonData.skuStockList[selectIndex].points:getCommonData.product.usePointLimit }}</text>
						<text class="common-history">已兑换 {{ getCommonData.product.sale }} 件</text>
						<!-- 分享 -->
						<view class="share">
							<view class="fixedIcon" @click="isShareBox = true;isPopupShare = true">
								<view class="icon">
									<image class="img" src="/static/img/iconShare.png"></image>
								</view>
								<text class="text">分享</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 选择规格 -->
			<view class="common-size-box">
				<view class="size-box">
					<view class="size-title"><text>选择</text></view>
					<view class="size-select">
						<view class="size-top" @click="setPopupShow(0)">
							<text class="top-text">选择规格</text>
							<image src="@/static/img/common-selct.png" mode="" class="top-image"></image>
						</view>
						<view class="size-bottom">
							<view class="size-bottom-imge" v-if="getCommonData.skuStockList">
								<view class="bottom-image-box" v-for="(item, key) in setSpecificationArr.arr" :key="key">
									<image :src="item.pic" mode="" class="size-image"></image>
								</view>
							</view>
							<view class="size-bottom-title">
								<view class="bottom-title-text" v-if="getCommonData.skuStockList">
									<text>共有 {{ setSpecificationArr.arrLength }} 种规格可选</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 活动 -->
			<view class="common-activity" v-if="setCommonData.hotType != 2">
				<view class="activity-title"><text>活动</text></view>
				<view class="activity-text">
					<text class="top-text">购买可获得{{ getCommonData.product.giftPoint?getCommonData.product.giftPoint: '' }}积分</text>
					<!-- <image src="@/static/img/common-selct.png" mode="" class="top-image"></image> -->
				</view>
			</view>
			<!-- 说明页面-->
			<view class="common-state">
				<view class="state-title"><text>说明:</text></view>
				<view class="state-text">{{ getCommonData.product.description }}</view>
			</view>
			<!-- 详情页面-->
			<view class="common-state">
				<view class="state-title"><text>详情:</text></view>
				<view class="state-text">
					<image v-for="(item, index) in detailPics" :key="index" :src="item" mode="widthFix" @click="handlePreview(index)" class="detail-pics"></image>
				</view>
			</view>
			<!-- 底部的推荐列表 -->
			<view class="common-recommend">
				<view class="recommend-title">推荐商品</view>
				<shoppingList :list="recommendList" :hotType="setCommonData.hotType"></shoppingList>
			</view>
			<view class="common-bar-bottom" style="position: relative;"></view>
			<!-- 弹出提示 -->
			<toast ref="toast"></toast>
		</scroll-view>
		<!-- 弹出底部规格 -->
		<commonPopup :show="popupShow" @close="setPopupHidden" :commonData="getCommonData" :type="selectType" :moneyType="setCommonData.hotType" @sendPointsIndex="getPointsIndex"></commonPopup>
		<!-- 底部的选择 -->
		<view class="common-bar" v-if="setCommonData.hotType != 2">
			<view class="bar-left">
				<view class="icon-left" @click="openTip(0)">
					<image src="@/static/img/common-cart.png" mode="" v-if="!collectAndCart.cart"></image>
					<image src="@/static/img/cart-action.png" mode="" v-if="collectAndCart.cart"></image>
					<text :class="{ setBlue: collectAndCart.cart }">购物车</text>
				</view>
				<view class="icon-right" @click="openTip(1)">
					<image src="@/static/img/common-star.png" mode="" v-if="!collectAndCart.collect"></image>
					<image src="@/static/img/star-action.png" mode="" v-if="collectAndCart.collect"></image>
					<text :class="{ setBlue: collectAndCart.collect }">收藏</text>
				</view>
			</view>
			<view class="bar-right">
				<view class="cart global-button-one" @click="setPopupShow(1)">加入购物车</view>
				<view class="buy global-button-two" @click="setPopupShow(2)">立刻购买</view>
			</view>
		</view>
		<view class="common-bar" v-if="setCommonData.hotType == 2">
			<view class="setbarright">
				<view class="buy global-button-two" @click="setPopupShow(0)">立刻兑换</view>
			</view>
		</view>
		<!-- 分享弹窗 -->
		<view class="Popup-share mask" @touchmove.stop @click="isShareBox = false; isShareMomentsBox = false" v-show="isShareBox">
			<view class="Popup-share-box" @click.stop v-show="isPopupShare">
				<view class="Popup-share-close" @click="closeShareMomentsBox">
					X
				</view>
				<view class="Popup-share-title">
					<text>分享智海</text>
				</view>
				<view class="Popup-share-buts">
					
					<button type="default" @click="closeShareMomentsBox" class="share-button" open-type="share">
						<image class="img" src="/static/img/WeChaticon.png" mode=""></image>
						<view>微信朋友</view>
					</button>
					<!-- <button type="default" class="share-button" @click="isShareMomentsBox = true"> -->
					<button type="default" class="share-button" @click="preservationImg">
						<image class="img" src="/static/img/MomentsIcon.png" mode=""></image>
						<view>朋友圈</view>
					</button>
				</view>
			</view>
			<view class="share-moments-box" @click.stop v-if="isShareMomentsBox">
				<view class="share-moments-title">
					<text>图片已经保存到相册</text>
				</view>
				<view class="img-box" @touchmove.stop>
					<canvas canvas-id="shareCanvas" @touchmove.stop class="canvasName"></canvas>
				</view>
				<view class="share-moments-content">
					<text>快去朋友圈分享吧~</text>
				</view>
				<view class="share-moments-but">
					<button class="but-close-moments" type="default" @click="closeShareMomentsBox">我知道了</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import sharePopup from '@/components/sharePopup/sharePopup.vue'
	import commonPopup from '@/components/ocean-common-popup/common-popup.vue';
	import shoppingList from '@/components/ocen-shopping-list/shopping-list.vue';
	import {
		productDetail,
		getRandProduct,
		addCollectList,
		addShoppingCart,
		existStatus,
		isCollet,
		closeCollerList,
		closeCartList,
		getDetailQrCode
	} from '@/api/main/main.js';
	import {
		getClassifyResultList
	} from '@/api/main/classify.js';
	import {
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				
				isShareBox: false,  // 分享弹窗遮罩的状态
				isPopupShare: false,	// 分享弹窗按钮的状态
				isShareMomentsBox: false,   // 分享到朋友圈弹窗的状态
				collectAndCart: {
					cart: 0,
					collect: 0
				},
				setCommonData: {}, //页面传递的数据
				getCommonData: {
					product: {}
				}, //页面渲染的数据
				detailPics: [],
				popupShow: false, //是否显示
				selectType: 0, //选择显示的按钮
				recommendList: [],
				showTipText: null,
				setPage: {
					//显示的页数
					pageNum: 1,
					pageSize: 12
				},
				cartId: null, //购物车的id
				fullPicUrls: [],
				pageRouteQuery: null,
				selectIndex: 0, // 规格的索引
				detailsID: 0 	// 商品详情id
			};
		},
		methods: {
			// 获取规格弹窗内的规格索引
			getPointsIndex(e) {
				this.selectIndex = e;
			},
			// 设置轮播视频暂停
			changeSwiper(e) {
				// console.log(e)
				const itemid = e.detail.currentItemId;
				if (itemid.indexOf('mp4') == -1) {
					this.videoContext.pause();
				}
			},
			// 轮播图点击
			handleFullImage(e, f) {
				let urls = [];
				this.fullPicUrls.forEach((item, index) => {
					if (item.indexOf("mp4") == -1) {
						urls.push(item);
					}
				})
				if (e.indexOf("mp4") == -1) {
					uni.previewImage({
						current: f,
						urls: urls
					})
				}
			},
			...mapMutations(['selectCommonData']),
			// 设置弹出层是否显示
			setPopupShow(value) {
				// console.log(this.$utils.goLoginPage("../login/login"),"1111111")	
				if (this.$utils.goLoginPage("../login/login")) {
					return;
				}
				this.selectType = value;
				this.popupShow = true;
			},
			setPopupHidden() {
				this.popupShow = false;
				this.existStatus();
			},
			// 设置默认弹窗方法
			setToastShow(params) {
				this.$refs.toast.show({
					...params
				});
			},
			// 开启弹窗
			openTip(value) {
				//判断值是 什么 0 是购物车 1 是收藏
				if (this.$utils.goLoginPage("../login/login")) {
					return;
				}
				if (value) {
					//取消 收藏
					if (this.collectAndCart.collect) {
						this.closeCollerList();
					} else {
						this.joinCollectPage();
					}
				} else {
					this.joinShoppingCart();
				}
			},
			// 点击详情图片
			handlePreview(e) {
				uni.previewImage({
					current: e,
					urls: this.detailPics
				})
			},

			// 获取商品
			async productDetail(id) {
				id = id?id:this.setCommonData.id
				let data = await productDetail(id);
				this.setCommonData = {
					...this.setCommonData,
					...data.data.data.product
				}
				console.log('商品详情信息',this.setCommonData)
				this.getCommonData = data.data.data;
				this.detailPics = this.getCommonData.product.albumDetailPics.split(',');
				console.log('这是商品',data)
				console.log('这是商品规格', this.getCommonData.skuStockList)
				
				
				
			
				
				
				// 获取推荐的数据
				if (this.setCommonData.hotType == 2) {
					this.getecommendList();
					// console.log(this.recommendList)
				} else {
					this.getClassifyResultList();
				}
			},

			// 获取积分推荐商品

			async getecommendList() {
				let data = await getRandProduct(1);
				this.recommendList = data.data.data.list;
				// console.log(data)
			},

			// 获取普通推荐商品
			async getClassifyResultList() {
				let data = await getClassifyResultList({
					productCategoryId: this.getCommonData.product.productCategoryId,
					sort: 0,
					...this.setPage
				});
				this.recommendList = data.data.data.list;
				// console.log(data)
			},

			// 加入收藏
			async joinCollectPage() {
				// console.log(this.getCommonData.skuStockList[0].pic)
				let data = {
					productId: this.getCommonData.product.id,
					productName: this.getCommonData.product.name,
					productPic: this.getCommonData.product.pic,
					productPrice: this.getCommonData.product.price,
					productSubTitle: this.getCommonData.product.subTitle
				};
				let res = await addCollectList(data);
				// console.log('这是收藏', res);
				this.setToastShow({
					title: '加入成功',
					duration: 1000
				});
				this.isColler();
			},

			// 加入购物车
			async joinShoppingCart() {
				if (this.collectAndCart.cart) {
					this.selectCommonData(this.getCommonData);
					uni.switchTab({
						url: '/pages/shopping-cart/shopping-cart'
					})
				} else {
					let data = {
						deleteStatus: 0,
						price: this.getCommonData.skuStockList[0].price,
						productAttr: this.getCommonData.skuStockList[0].spData,
						productCategoryId: this.getCommonData.product.productCategoryId,
						productId: this.getCommonData.product.id,
						productName: this.getCommonData.product.name,
						productPic: this.getCommonData.skuStockList[0].pic,
						productSkuCode: this.getCommonData.skuStockList[0].skuCode,
						productSkuId: this.getCommonData.skuStockList[0].id,
						productSn: this.getCommonData.product.productSn,
						productSubTitle: this.getCommonData.product.subTitle,
						quantity: 1
					};
					let res = await addShoppingCart(data);
					// this.setToastShow({
					// 	title: '加入成功',
					// 	duration: 1000
					// });
					this.existStatus();
					this.selectCommonData(this.getCommonData);
					uni.switchTab({
						url: '/pages/shopping-cart/shopping-cart'
					})
				}

			},

			// 判断是否被收藏
			async isColler() {
				let data = await isCollet(this.detailsID);
				// console.log(this.setCommonData.id)
				// console.log('这是收藏的信息',data)
				if (data.data.code == 200) {
					if (data.data.data) {
						this.collectAndCart.collect = 1;
					} else {
						this.collectAndCart.collect = 0;
					}
				}
			},

			// 判断是否存在购物车
			async existStatus() {
				let data = await existStatus(this.detailsID);
				this.collectAndCart.cart = data.data.data.existStatus;
				// console.log('这是购物车',data)
				if (data.data.data.cartId) {
					this.cartId = data.data.data.cartId;
				}
			},

			// 取消购物车
			async closeShoppingCart() {
				if (this.cartId) {
					let data = await closeCartList(this.cartId);
					this.setToastShow({
						title: '取消成功',
						duration: 1000
					});
					this.existStatus();
				}
			},

			// 取消收藏
			async closeCollerList() {
				let data = await closeCollerList([this.setCommonData.id]);
				// console.log(data);
				this.setToastShow({
					title: '取消成功',
					duration: 1000
				});
				this.isColler();
			},
			// 分享到朋友圈
			preservationImg() {
				uni.showLoading({
					title: '图片保存中...',
					mask: true
				})
				this.isShareMomentsBox = true
				this.isPopupShare = false
				const _this = this
				// 是否授权相册
				uni.authorize({
					scope: 'scope.writePhotosAlbum',
					success() {
						// console.log('已授权')
						
						const ctx = uni.createCanvasContext('shareCanvas')
						// 背景图
						ctx.drawImage('/static/img/shareBackground.png', -3, 0, 285, 405)
						ctx.draw(true)
						// 文字
						for(let i = 0; i<_this.getCommonData.product.name.length / 10; i++) {
							// ctx.setFontSize(20)
							if (i === 2 && _this.getCommonData.product.name.length >= 30) {
								ctx.font = '20px HuXiaoBo-NanShen bold'
								ctx.setFillStyle('#fdfdfd')
								ctx.fillText(_this.getCommonData.product.name.slice(i * 10, i * 10 + 8) + '...', 40, 55 + (i * 28))
								ctx.draw(true)
								break
							}
							ctx.font = '20px HuXiaoBo-NanShen bold'
							ctx.setFillStyle('#fdfdfd')
							ctx.fillText(_this.getCommonData.product.name.slice(i * 10, (i + 1) * 10), 40, 55 + (i * 28))
							ctx.draw(true)
						}
						
						// 二维码
						// ctx.drawImage('/static/img/zhihaiCode.png', 64, 195, 150, 150)
						// ctx.draw(true)
						
						// 把canvas导出成为图片
						// setTimeout(()=> {
						// 	uni.canvasToTempFilePath({
						// 		canvasId: 'shareCanvas',
						// 		success: function(res) {
						// 		    // 在H5平台下，tempFilePath 为 base64
									
						// 			// 把图片存到手机相册
						// 			console.log(res.tempFilePath)
						// 			uni.saveImageToPhotosAlbum({
						// 				filePath: res.tempFilePath,
						// 				success() {
						// 					console.log('yinc')
						// 					uni.hideLoading()
						// 				}
						// 			})
						// 		} 
						// 	})
						// }, 500)
						
						// 下载二维码
						// console.log("/pages/main/commodity-details/commodity-details?data=" + _this.detailsID, _this.detailsID)
						getDetailQrCode("pages/main/commodity-details/commodity-details?data=" +  _this.detailsID + '&hotType=' + _this.setCommonData.hotType, _this.detailsID).then(res => {
							// console.log(res.data)
							// uni.showToast({
							//     title: res.data.data,
							//     icon: 'none',
							// 	duration: 2000
							// });
							if(res.data.code === 401) {
								// console.log(401)
								uni.hideLoading()
								_this.isShareBox = false,  // 分享弹窗遮罩的状态
								_this.isPopupShare = false,	// 分享弹窗按钮的状态
								_this.isShareMomentsBox = false,   // 分享到朋友圈弹窗的状态
								uni.switchTab({
									url: '/pages/user/user',
									fail() {
										// console.log('sshibai')
									}
								})
								uni.showToast({
								    title: '请登录！',
								    icon: 'none',
									duration: 2000
								});
								return;
							}
							uni.downloadFile({
							    url: res.data.data,
							    success: function (res) {
									// 二维码
									ctx.drawImage(res.tempFilePath, 64, 195, 150, 170)
									ctx.draw(true)
									
									
									// 把canvas导出成为图片
									setTimeout(()=> {
										uni.canvasToTempFilePath({
											canvasId: 'shareCanvas',
											success: function(res) {
											    // 在H5平台下，tempFilePath 为 base64
												
												// 把图片存到手机相册
												console.log(res.tempFilePath)
												uni.saveImageToPhotosAlbum({
													filePath: res.tempFilePath,
													success() {
														console.log('yinc')
														uni.hideLoading()
													}
												})
											} 
										})
									}, 500)
							    },
								fail(err) {
									uni.hideLoading()
									_this.isShareBox = false;  // 分享弹窗遮罩的状态
									_this.isPopupShare = false;	// 分享弹窗按钮的状态
									_this.isShareMomentsBox = false;   // 分享到朋友圈弹窗的状态
									uni.showToast({
									    title: '二维码下载失败！',
										// title: err,
									    icon: 'none',
										duration: 6000
									});
								}
							})
						
						}).catch(err => {
							uni.hideLoading()
							_this.isShareBox = false,  // 分享弹窗遮罩的状态
							_this.isPopupShare = false,	// 分享弹窗按钮的状态
							_this.isShareMomentsBox = false,   // 分享到朋友圈弹窗的状态
							uni.showToast({
							    title: '二维码生成失败！',
							    icon: 'none',
								duration: 2000
							});
						})
						// 
					},
					fail() {
						// console.log('未授权')
						// 掉起授权
						uni.openSetting({
							success(res) {
								// console.log(res.authSetting)
								// 如果授权成功
								if(res.authSetting['scope.writePhotosAlbum']){
									_this.preservationImg()
								}
							},
							fail() {
								// console.log('设置权限失败')
							}
						})
					}
				})
			
			},
			
			
			closeShareMomentsBox() {
				this.isShareBox = false;
				this.isPopupShare = false;
				this.isShareMomentsBox = false;
			},
		},
		onLoad(obj) {
			console.log('页面数据',obj)
			
			this.setCommonData.hotType = obj.hotType
			this.detailsID = obj.data;
			// this.productDetail(obj.data);
			this.existStatus();
			this.isColler();
		},
		onReady() {
			this.videoContext = uni.createVideoContext('swiper-video-detail')
		},
		onShow() {
			this.productDetail(this.detailsID);
			this.existStatus();
			this.isColler();
			this.selectCommonData(null);
		},
		// 页面分享
		onShareAppMessage(res) {
			let currentPage = getCurrentPages();
			// console.log(this.setCommonData)
			return {
				path: "/pages/main/commodity-details/commodity-details?data=" + this.detailsID + '&hotType=' + this.setCommonData.hotType,
				title: currentPage[currentPage.length - 1].$vm._data.setCommonData.subTitle,
				imageUrl: ''
			}
		},
		computed: {
			setBannerImg() {
				// console.log(this.getCommonData);
				if (this.getCommonData.product.albumPics) {
					let arr = this.getCommonData.product.albumPics.split(',');
					arr = [this.getCommonData.product.pic, ...arr];
					if (this.getCommonData.product.brandName) {
						arr = [this.getCommonData.product.brandName, ...arr];
					}
					// console.log(this.getCommonData.product.albumDetailPics.split(',')[0]);
					// arr = this.getCommonData.product.albumPics.split(',');
					// console.log(arr);
					this.fullPicUrls = arr;
					return arr;
				} else {
					return [];
				}
			},
			setSpecificationArr() {
				if (this.getCommonData.skuStockList) {
					return {
						arr: this.getCommonData.skuStockList.slice(0, 4),
						arrLength: this.getCommonData.skuStockList.length
					};
				} else {
					return {
						arr: [],
						arrLength: 0
					};
				}
			}
		},
		filters: {
			// 过滤文字显示标题
			setCommonName(value) {
				if (value) {
					return value ? (value.length > 10 ? value.slice(0, 10) + '...' : value) : null;
				} else {
					return '';
				}
			}
		},
		components: {
			commonPopup,
			shoppingList,
			sharePopup
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
	.common-details {
		position: fixed;
		width: 750rpx;
		height: 100vh;
	}

	// banner位置
	.common-banner {
		width: 750rpx;
		height: 750rpx;

		.one {
			width: 100%;
			height: 100%;
		}

		.two {
			width: 100%;
			height: 100%;
		}

		.three {
			width: 100%;
			height: 100%;
		}
	}

	.swiper-item {
		background-color: black;
		position: relative;
		overflow: hidden;
		image {
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			margin: auto;
		}

		video {
			position: absolute;
			width: 100%;
			background-color: black;
			top: 50%;
			transform: translateY(-50%);
		}
	}

	// 标题位置
	.common-title-box {
		background: rgba(255, 255, 255, 1);
		box-shadow: 0rpx 0rpx 18rpx 0rpx rgba(119, 119, 119, 0.15);
		width: 750rpx;
		// height: 210rpx;
		max-height: 210rpx;
	}

	.title-box {
		margin: 0 30rpx;

		.common-title {
			padding-top: 10rpx;
			font-size: 33rpx;
			// height: 87rpx;
			max-height: 87rpx;
			line-height: 46rpx;
			font-weight: 500;
			color: rgba(51, 51, 51, 1);

			.common-title-text {
				overflow: hidden;
				letter-spacing: 3rpx;
				word-break: break-all;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
			}
		}
		// .common-price-row {
		// 	display: flex;
		// 	justify-content: space-between;
		// }

		.common-price {
			padding: 15rpx 0;
			position: relative;
			.common-price-icon {
				height: 35rpx;
				font-size: 40rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(250, 4, 4, 1);
			}

			.common-price-text {
				height: 35rpx;
				font-size: 50rpx;
				font-family: PingFang SC;
				font-weight: 600;
				color: rgba(250, 4, 4, 1);
			}

			.common-price-last {
				height: 35rpx;
				font-size: 40rpx;
				font-family: PingFang SC;
				font-weight: 600;
				color: rgba(250, 4, 4, 1);
			}

			.common-history {
				padding-left: 20rpx;
				font-size: 28rpx;
				font-weight: 500;
				color: rgba(153, 153, 153, 1);
			}
			.share {
				width: 60rpx;
				height: 100rpx;
				position: absolute;
				right: 0;
				top: -15rpx;
			}
		}
	}

	// 规格
	.common-size-box {
		background: rgba(255, 255, 255, 1);
		box-shadow: 0rpx 0rpx 18rpx 0rpx rgba(119, 119, 119, 0.15);
		width: 750rpx;
		height: 190rpx;
		margin-top: 20rpx;
	}

	.size-box {
		margin: 0 30rpx;
		display: flex;
		justify-content: space-between;
	}

	.size-title {
		font-size: 35rpx;
		line-height: 80rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
	}

	.size-select {
		width: 570rpx;

		.size-top {
			line-height: 80rpx;
			display: flex;
			justify-content: space-between;

			.top-text {
				font-size: 30rpx;
				font-weight: 500;
				color: rgba(102, 102, 102, 1);
			}

			.top-image {
				line-height: 120rpx;
				width: 10rpx;
				height: 20rpx;
				margin-top: 35rpx;
			}
		}

		.size-bottom {
			height: 110rpx;
			display: flex;
			justify-content: space-between;
		}
	}

	.size-bottom-imge {
		width: 60%;
		height: 110rpx;
		display: flex;

		// justify-content: space-between;
		.bottom-image-box {
			height: 110rpx;
			width: 25%;
			position: relative;

			.size-image {
				position: absolute;
				top: 40%;
				left: 50%;
				transform: translate(-50%, -50%);
				width: 70rpx;
				height: 70rpx;
			}
		}
	}

	.size-bottom-title {
		height: 110rpx;
		width: 40%;
		position: relative;

		.bottom-title-text {
			display: inline-block;
			position: absolute;
			top: 40%;
			transform: translateY(-50%);
			font-size: 24rpx;
			right: 0;
			font-weight: 500;
			color: rgba(102, 102, 102, 1);
			padding: 10rpx 15rpx;
			background: rgba(229, 229, 229, 1);
			border-radius: 5rpx;
		}
	}

	// 活动页面
	.common-activity {
		background: rgba(255, 255, 255, 1);
		margin-top: 18rpx;
		width: 690rpx;
		box-shadow: 0rpx 0rpx 18rpx 0rpx rgba(119, 119, 119, 0.15);
		height: 40rpx;
		line-height: 40rpx;
		padding: 30rpx;
		display: flex;
		justify-content: space-between;

		.activity-title {
			font-weight: 500;
			color: rgba(102, 102, 102, 1);
			font-size: 35rpx;
		}

		.activity-text {
			display: flex;
			width: 570rpx;
			justify-content: space-between;

			.top-text {
				font-size: 28rpx;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
			}

			.top-image {
				width: 10rpx;
				height: 20rpx;
				margin-top: 10rpx;
			}
		}
	}

	// 说明页面
	.common-state {
		background: rgba(255, 255, 255, 1);
		margin-top: 18rpx;
		width: 690rpx;
		box-shadow: 0rpx 0rpx 18rpx 0rpx rgba(119, 119, 119, 0.15);
		padding: 30rpx;

		.state-title {
			height: 40rpx;
			line-height: 40rpx;
			font-weight: 500;
			color: rgba(102, 102, 102, 1);
			font-size: 35rpx;
		}
	}

	// 底部按钮
	.common-bar {
		position: fixed;
		bottom: 0;
		width: 750rpx;
		height: 110rpx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0rpx 0rpx 8rpx 0rpx rgba(119, 119, 119, 0.15);
		display: flex;
		justify-content: space-between;

		.bar-left {
			display: flex;
			justify-content: space-between;
			text-align: center;
			width: 270rpx;
			height: 60rpx;
			padding: 25rpx 0rpx;
			font-size: 26rpx;
			font-weight: 500;
			color: rgba(153, 153, 153, 1);

			.icon-left {
				width: 50%;
				box-sizing: border-box;
				border-right: 1rpx solid rgba(191, 191, 191, 1);
				position: relative;

				text {
					color: #666666;
					position: absolute;
					bottom: -13rpx;
					left: 50%;
					transform: translateX(-50%);
					width: 100%;
					text-align: center;
				}
			}

			.icon-right {
				width: 50%;
				box-sizing: border-box;
				border-left: 1rpx solid rgba(191, 191, 191, 1);
				position: relative;

				text {
					color: #666666;
					position: absolute;
					bottom: -13rpx;
					left: 50%;
					transform: translateX(-50%);
					width: 100%;
					text-align: center;
				}
			}

			.setBlue {
				color: #333333 !important;
			}

			image {
				height: 50rpx;
				width: 50rpx;
				display: block;
				margin: 0 auto;
				transform: translateY(-10rpx);
			}
		}

		.bar-right {
			height: 110rpx;
			width: 480rpx;
			display: flex;
			justify-content: space-between;
			line-height: 110rpx;
			font-size: 34rpx;
			color: white;
			text-align: center;

			.cart {
				width: 50%;
				height: 110rpx;
				// background-color: rgba(0, 160, 233, 1);
			}

			.buy {
				width: 50%;
				height: 110rpx;
				// background: rgba(14, 90, 187, 1);
			}
		}

		.setbarright {
			width: 750rpx;
			height: 110rpx;
			background: rgba(20, 114, 220, 1);
			line-height: 110rpx;
			font-size: 34rpx;
			color: white;
			text-align: center;
		}
	}

	.common-bar-bottom {
		width: 750rpx;
		height: 250rpx;
	}

	.title-text {
		font-size: 35rpx;
		width: 300rpx;
		overflow: hidden;
		word-break: break-all;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
	}

	.recommend-title {
		font-weight: 500;
		color: rgba(102, 102, 102, 1);
		font-size: 35rpx;
		padding-top: 30rpx;
		padding-left: 30rpx;
		display: inline-block;
	}

	.state-text {
		display: flex;
		flex-direction: column;
		padding-top: 20rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);

		.detail-pics {
			width: 100%;
		}
	}

	// 底部弹出按钮
	.collectTip {
		background: rgba(255, 255, 255, 1);
		border-radius: 10rpx;
		width: 220rpx;
		height: 80rpx;
		background: rgba(0, 0, 0, 0.8);
		line-height: 80rpx;
		text-align: center;
		color: white;
	}
	// 分享按钮
	.fixedIcon {
		width: 60rpx;
		height: 100rpx;
		overflow: hidden;
		text-align: center;
		.icon {
			display: inline-block;
			width: 40rpx;
			height: 40rpx;
			transform: translateY(20rpx);
			.img {
				width: 100%;
				height: 100%;
			}
		}
		.text {
			width: 100%;
			font-size: 25rpx;
			color: #999999;
			transform: translateY(-15rpx);
			margin-top: -20rpx;
		}
	}
	
	// 分享弹框
	.mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0,0,0,.3);
		z-index: 9999999999;
		// pointer-events: none;
		.Popup-share-box {
			width: 600rpx;
			border-radius: 20rpx;
			background-image: #ffffff;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			background-color: #ffffff;
			padding: 60rpx 20rpx;
			.Popup-share-close {
				width: 50rpx;
				height: 50rpx;
				color: #333;
				text-align: center;
				line-height: 50rpx;
				position: absolute;
				right: 20rpx;
				top: 10rpx;
				transform: scaleX(1.3);
				z-index: 99;
			}
			.Popup-share-title {
				font-size: 40rpx;
				margin-bottom: 40rpx;
				// font-weight: bold;	
				text-align: center;
			}
			.Popup-share-buts {
				width: 100%;
				display: flex;
				.share-button {
					width: 40%;
					padding: 20rpx;
					font-size: 30rpx;
					background-color: #fff;
					border: 0;
					color: #7D7C7F;
					font-weight: bold;
					line-height: auto;
					.img {
						width: 100rpx;
						height: 100rpx;
					}
				}
				.button-hover {
					background-color: #f1f1f1;
				}
				.share-button::after{ border: none;}
			}
		}
		.share-moments-box {
			width: auto;
			height: auto;
			border-radius: 20rpx;
			background-color: #fff;
			padding: 20rpx;
			display: flex;
			justify-content: center;
			flex-wrap: wrap;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			.share-moments-title {
				margin: 20rpx;
				color: #333;
			}
			.img-box {
				width: 280px;
				height: 400px;
				.canvasName {
					width: 100%;
					height: 100%;
				}
			}
			.share-moments-content {
				width: 100%;
				text-align: center;
				margin: 20rpx 0;
				color: #333;
			}
			.but-close-moments {
				background-color: #fbfbfb;
				color: #333;
				
			}
		}
	}
	
	
</style>
