<template>
	<scroll-view class="site" id="site" :scroll-y="true" :show-scrollbar="false">
		<hxNavbar :fixed="true" :back="true" title="我的地址" color="#FFFFFF">
		</hxNavbar>
		<view class="site-box">
			<view class="content-no-text" v-if="!siteList[0]">
				<image src="@/static/img/blank.png" mode="" class="content-blank"></image>
				<view class="content-blank-text">暂无地址</view>
			</view>
			<view class="site-item" v-for="(item,index) in siteList" :key="index">
				<view class="site-content">
					<view class="site-item-title">
						<text>{{item.name}}</text>
						<text>{{item.iphone}}</text>
					</view>
					<view class="site-message">
						<text>{{item.siteMessage}}</text>
					</view>
				</view>
				<view class="radio-edit">
					<view class="radio" @click="whether(index)">
						<label class="radio">
							<radio value="radio" :checked="item.defaultStatus==1?true:false" style="transform: scale(0.9);">选择地址</radio>
						</label>
					</view>
					<view class="edit">
						<view class="edit-btn" @click="edit(item)">
							<view class="edit-image">
								<image src="../../../static/img/site-edit.png" mode=""></image>
							</view>
							<text>编辑</text>
						</view>
						<view class="delete" @click="deletesite(item,index)">
							<view class="delete-image">
								<image src="../../../static/img/site-delete.png" mode=""></image>
							</view>
							<text>删除</text>
						</view>
					</view>
				</view>
			</view>
			<tui-modal :show="show" @cancel="hide" @click="checkModel" title="提示" content="是否要删除地址？">
			</tui-modal>
			<view class="" style="height: 97rpx;"></view>
		</view>
		<view class="footer">
			<view class="add-site" @click="addSite">
				<text>新增地址</text>
			</view>
		</view>

	</scroll-view>
</template>

<script>
	import {
		getAddressList,
		getUpdate,
		getDelete
	} from '@/api/user/address.js'
	export default {
		data() {
			return {
				siteList: {},
				show: false,
				iconSmall: "icon-small",
				deleteContent: {
					num: '',
					idnum: ''
				},
				setBackType:false
			}
		},
		methods: {
			async getAddressList() {
				let res = await getAddressList()
				this.siteList = res.data.data
			},
			// 选择默认地址
			whether(index) {
				this.siteList.forEach((item, index) => {
					item.defaultStatus = 0
				})
				this.siteList[index].defaultStatus = 1
				// console.log(this.siteList[index].id);
				this.getUpdate(1, this.siteList[index].id)
				
				if(this.setBackType){
					uni.navigateBack({
						
					})
				}
			},
			WecharSite(){
				uni.chooseAddress({
				  success(res) {
				    console.log(res.userName)
				    console.log(res.postalCode)
				    console.log(res.provinceName)
				    console.log(res.cityName)
				    console.log(res.countyName)
				    console.log(res.detailInfo)
				    console.log(res.nationalCode)
				    console.log(res.telNumber)
				  }
				})
			},
			async getUpdate(num, id) {
				let data = {
					// id:14,
					defaultStatus: num
				}
				let res = await getUpdate(data, id)
				console.log(res);
			},
			edit(item) {
				uni.navigateTo({
					url: "../edit/edit?item=" + encodeURIComponent(JSON.stringify(item))
				})
			},
			addSite() {
				uni.navigateTo({
					url: "../add-site/add-site"
				})
			},
			deletesite(item, index) {
				this.show = true
				this.deleteContent.num = index
				this.deleteContent.idnum = item.id
				console.log(this.deleteContent);
			},
			showPopup() {
				this.show = true;
			},
			hidePopup(item, key) {
				this.show = false
				console.log(item, key);
				this.cause = item
				console.log(this.Statement);
			},
			hide() {
				this.show = false
			},
			no() {
				this.show = false
			},
			async yes() {
				this.show = false
				let res = await getDelete(this.deleteContent.idnum)
				uni.showToast({
					title:'删除成功',
					duration:1000,
					icon:'none'
				})
				this.getAddressList();
			},
			// 关闭model
			checkModel(e){
				if(e.index==0){
					this.no()
				}else{
					this.yes()
				}
			}
		},
		onLoad(obj) {
			// 获取所有地址
			console.log(obj.type)
			if(obj.type){
				this.setBackType=false;
			}else{
				this.setBackType=true;
			}
		},
		onShow() {
			// }
			// this.getUpdate()
			this.getAddressList()

		}
	}
</script>

<style>
	scroll-view ::-webkit-scrollbar {
		width: 0;
		height: 0;
		background-color: transparent;
	}
</style>
<style lang="scss">
	.site {
		width: 750rpx;
		// height: 100vh;
		display: fixed;

		::-webkit-scrollbar {
			width: 0;
			height: 0;
			background-color: transparent;
		}

		.site-box {
			// margin-top: 20rpx;
			// height: 100vh;
			overflow: hidden;
			overflow-y: auto;
			.site-item:nth-child(1){
				margin-top: 0;
			}
			.site-item {
				// margin-top: 20rpx;
				box-shadow: 0px 5rpx 18rpx 0px rgba(119, 119, 119, 0.1);
				margin: 15rpx 0;
				.site-content {
					margin: 0 30rpx;

					border-bottom: 1rpx solid rgba(153, 153, 153, 0.2);

					.site-item-title {
						display: flex;
						margin-bottom: 15rpx;
						padding-top: 20rpx;
						text {
							flex: 1 1 auto;
							font-size: 33rpx;
							font-family: PingFang SC;
							font-weight: bold;
							color: rgba(51, 51, 51, 1);
						}

						text:nth-child(2) {
							text-align: right;
							font-size: 24rpx;
							font-family: PingFang SC;
							font-weight: bold;
							color: rgba(51, 51, 51, 1);
						}
					}
				}

				
			}

			.radio-edit {
				margin: 0 30rpx;
				height: 100rpx;
				line-height: 100rpx;
				display: flex;
				justify-content: space-between;
				position: relative;
				view {
					// flex: 1 1 auto;

				}

				.radio {
					font-size: 35rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: rgba(102, 102, 102, 1);
					// flex: 3;
				}

				.edit {
					display: flex;
					position: relative;
					width: 200rpx;
					font-size: 30rpx;
					.edit-btn {
						display: flex;
						position: absolute;
						height: 100%;
						width: 47%;
						left: 0;
						.edit-image {
							position: relative;
							image {
								width: 30rpx;
								height: 30rpx;
								position: absolute;
								top: 50%;
								left: 0;
								transform: translateY(-50%);
							}
						}

						text {
							font-family: PingFang SC;
							font-weight: 400;
							color: rgba(102, 102, 102, 1);
							position: absolute;
							top: 50%;
							right: 0;
							transform: translateY(-50%);
						}
					}

					.delete {
						display: flex;
						position: absolute;
						height: 100%;
						width: 47%;
						right: 0;
						.delete-image {
							position: relative;
							image {
								width: 30rpx;
								height: 30rpx;
								position: absolute;
								top: 50%;
								left: 0;
								transform: translateY(-50%);
							}
						}
						
						text {
							font-family: PingFang SC;
							font-weight: 400;
							color: rgba(102, 102, 102, 1);
							position: absolute;
							top: 50%;
							right: 0;
							transform: translateY(-50%);
						}

					}
				}
			}
		}

		.footer {
			position: fixed;
			bottom: 0;
			width: 750rpx;
			display: flex;
			height: 120rpx;

			view {
				text-align: center;
				flex: 1;
				height: 120rpx;
				line-height: 120rpx;
				background-color: #000000;
				color: white;

				box-shadow: 0px 0rpx 9rpx 0px rgba(119, 119, 119, 0.28);

				text {
					text-align: center;
					font-size: 36rpx;
					font-family: PingFang SC;
					font-weight: 500;
				}
			}

			view:nth-child(2) {
				// background: rgba(9, 104, 245, 1);

				text {
					color: #ffffff;
				}
			}
			.wechar-site{
				background-color: #666666;
			}
		}

		.deleteaffirm-box {
			width: 100%;
			height: 300rpx;

			.are-you-sure {
				height: 150rpx;
				line-height: 150rpx;
				text-align: center;
				border-bottom: 1rpx solid gray;
				font-size: 30rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: rgba(51, 51, 51, 1);
			}

			.delete-btn-box {
				display: flex;
				justify-content: space-between;

				.cancel,
				.affirm {
					width: 49.9%;
					height: 150rpx;
					line-height: 150rpx;
					text-align: center;
					font-size: 36rpx;
					font-family: PingFang SC;
					font-weight: bold;
					color: rgba(102, 102, 102, 1);
				}

				.cancel {
					border-right: 1rpx solid gray;
				}

				.yes {
					color: #1462D6;
				}
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
	.add-site{
		background-color: #000000;
		color: white;
	}
	.siteMessage{
		line-height: 61rpx !important;
	}
</style>
