<template>
	<view class="search">
		<hxNavbar  :back="true" :fixed="true" title="搜索"  color="#ffffff" />
		<view class="search-header">
			<view class="search-header-box">
				<view class="search-header-icon-box">
					<image src="@/static/img/back-search.png" mode="" class="search-header-icon"></image>
				</view>
				<input type="text" placeholder="请输入要搜索的商品名称" v-model="searchText" class="search-header-input" confirm-type="搜索" @confirm='search' placeholder-class="setSearchText"/>
			</view>
		</view>
		<view class="search-body">
			<view class="search-body-title">
				历史搜索
			</view>
			<view class="body-item-box" v-if="historyList[0]">
				<view class="body-item" v-for="(item,key) in historyList" :key="key" @click="goSearchResultPage(item)">
					{{item}}
				</view>
			</view>
			<view class="body-item-box" v-if="!historyList[0]">
				<view class="body-item-text">暂无搜索记录</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchText:'',
				historyList:[]
			}
		},
		methods: {
			// 搜索跳转
			search(){
				if(this.searchText!=''){
					let text = this.searchText;
					this.historyList.unshift(text);
					this.searchText='';
					uni.setStorage({
						key:'historyList',
						data:this.historyList,
						success: () => {
							uni.navigateTo({
								url:'/pages/main/search-result/search-result?searchText='+text
							})
						}
					})
				}
			},
			// 点击搜索记录跳转
			goSearchResultPage(value){
				uni.navigateTo({
					url:'/pages/main/search-result/search-result?searchText='+value
				})
			},
			// 获取本地的搜索数据
			getHistoryList(){
				// 直接设置数组
				const historyList = uni.getStorageSync('historyList')
				if(historyList){
					this.historyList=historyList
				}else{
					this.historyList=[]
				}
			}
		},
		onLoad(){
			this.getHistoryList()
		}
	}
</script>

<style lang="scss" scoped>
.search{
	
}
// 头部
.search-header{
	height: 60rpx;
	padding: 0 30rpx;
	padding-top: 10rpx;
	margin-bottom: 70rpx;
}
.search-header-box{
	width: 690rpx;
	background:rgba(255,255,255,1);
	box-shadow:0rpx 0rpx 9rpx 0rpx rgba(119,119,119,0.4);
	border-radius:27rpx;
	overflow: hidden;
	display: flex;
}
.search-header-icon-box{
	height: 70rpx;
	width: 70rpx;
	position: relative;
}
.search-header-icon{
	height: 30rpx;
	width: 30rpx;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%,-50%);
}
.search-header-input{
	height: 70rpx;
	font-size: 30rpx;
	color: rgba(0,0,0,0.7);
}
.setSearchText{
	color: rgba(0,0,0,0.3);
}
// 身体
.search-body-title{
	padding-left: 30rpx;
	padding-bottom: 8rpx;
	font-size:36rpx;
	font-family:PingFang SC;
	font-weight:500;
	color:rgba(51,51,51,1);
}
.body-item-box{
	display: flex;
	padding: 0 20rpx;
	flex-wrap: wrap;
	height: 120rpx;
	overflow: hidden;
	.body-item{
		display: inline-block;
		padding: 0 15rpx;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 30rpx;
		background:rgba(153,153,153,0.43);
		color: rgba(51, 51, 51, 1);
		margin: 10rpx 10rpx;
		border-radius: 5rpx;
	}
}
.body-item-text{
	display: block;
	width: 100%;
	text-align: center;
	line-height: 100rpx;
	color: #82848A;
}
</style>
