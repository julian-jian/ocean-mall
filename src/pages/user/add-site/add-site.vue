<template>
	<view class="addSite" id="addSite">
		<hxNavbar :fixed="true" :back="true" title="我的地址" color="#FFFFFF">
		</hxNavbar>
		<view class="add-box">
			<input class="name" placeholder="名字" v-model="name" placeholder-style="color:#666666;" />
			<input class="iphone" placeholder="手机号码" v-model="iphone" placeholder-style="color:#666666;"/>
			<view class="siteMessage" @click="addressShow = true">
				<!-- 省市区 -->
				{{siteMessage.province||'省份'}}
				{{siteMessage.city||'市区'}}
				{{siteMessage.area||'县'}}
				<!-- <input class="" placeholder="省份 城市 区县" v-model="siteMessage" /> -->
				<pickerAddress v-model="addressShow" @confirm="addresspick" />
			</view>
			<input class="siteDetails" v-model='siteDetails' placeholder="详细地址 如楼道等" placeholder-style="color:#666666;"/>
		</view>
		<view :class="{'footer-save':true,'footer-save-backColor':add}" @click="saveAdd">
			<view class="save-add">
				保存
			</view>
		</view>
	</view>
</template>

<script>
	import pickerAddress from '@/components/ocean-pickerAddress/index.vue'
	import {
		getAddress
	} from '@/api/user/address.js'
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				addressShow: false,
				form: {
					province: '',
					city: '',
					area: '',
				},
				name: "",
				iphone: "",
				siteMessage: {
					province: '',
					city: '',
					area: ''
				},
				siteDetails: "",
				footerBtn: "footer-save",
				// userInfo:{}
			}
		},
		components: {
			pickerAddress
		},
		methods: {
			addresspick(obj) {
				let arr = ['province', 'city', 'area'];
				// let place = '';
				arr.map(key => {
					this.form[key] = obj[key].id
					this.siteMessage[key] = obj[key]||''
					console.log(this.siteMessage[key]);
				})
			},
			// 保存
			saveAdd() {
				let data = {
					name: this.name, //姓名
					phoneNumber: this.iphone, //手机号
					detailAddress: this.siteDetails, //详细地址
					province: this.siteMessage.province, //省份
					city: this.siteMessage.city, //城市
					region: this.siteMessage.area.length!=0?this.siteMessage.area:'', //区
					defaultStatus: 0,
				}
				this.name != '' &&
					this.name != null &&
					this.iphone != '' &&
					this.iphone != null &&
					this.siteMessage.province != '' &&
					this.siteMessage.province != null &&
					this.siteMessage.city != '' &&
					this.siteMessage.city != null &&
					this.siteDetails != '' &&
					this.siteDetails != null ? successAdd() : errorAdd();
					
				if(this.name==null||this.name==''){
					uni.showToast({
						title:'请正确输入姓名',
						icon:'none',
						duration:1000
					})
					return
				}else if(this.iphone.length!=11&&parseInt(this.iphone).toString().length!=11){
					uni.showToast({
						title:'请正确输入手机号码',
						icon:'none',
						duration:1000
					})
					return
				}else if(this.siteMessage.province==null||this.siteMessage.province==''){
					uni.showToast({
						title:'请正确输入地址',
						icon:'none',
						duration:1000
					})
					return
				}else if(this.siteMessage.city==null||this.siteMessage.city==''){
					uni.showToast({
						title:'请正确输入地址',
						icon:'none',
						duration:1000
					})
					return
				}else if(this.siteDetails==null||this.siteDetails==''){
					uni.showToast({
						title:'请输入详细地址',
						icon:'none',
						duration:1000
					})
					return
				}

				function successAdd() {
					console.log('success');
					getAddress(data).then(res => {
						console.log(res);
						uni.navigateBack({
							
						})
					}).catch(err => {
						console.log(err);
					})
				}

				function errorAdd() {
					console.log('error');
				}
			},

		},
		mounted() {

		},
		computed: {
			...mapState('user', ['token', 'hasLogin', 'userInfo']),
			add() {
				if (this.name != '' && this.iphone != '' && this.siteMessage.province != '' && this.siteMessage.city != '' && this.siteDetails != '') {
					return true
				} else {
					return false
				}
			}
		}
	}
</script>

<style lang="scss">
	.addSite {
		width: 750rpx;
		height: 100vh;

		.add-box {
			width: 750rpx;
			background: rgba(255, 255, 255, 1);
			box-shadow: 0px 0px 9px 0px rgba(119, 119, 119, 0.28);
			margin-top: 20rpx;

			.name,
			.iphone,
			.siteMessage,
			.siteDetails {
				margin-left: 31rpx;
				margin-right: 31rpx;
				height: 61rpx;
				padding: 20rpx 0;
			}

			.name,
			.iphone,
			.siteMessage {
				border-bottom: 1rpx solid rgba(153, 153, 153, 0.49);
			}

			.siteDetails {
				padding-bottom: 63rpx;
			}
		}

		.footer-save {
			position: fixed;
			bottom: 0;
			width: 750rpx;
			height: 120rpx;
			line-height: 120rpx;
			text-align: center;
			background: #666666;
			box-shadow: 0px 0px 9rpx 0px rgba(119, 119, 119, 0.28);
			color: white;
			font-size: 36rpx;
		}

		.footer-save-backColor {
			background: black;
		}
	}
	.site-message {
		line-height: 61rpx;
		text {
			font-size: 24rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(51, 51, 51, 1);
		}
	}
	.siteMessage{
		line-height: 61rpx !important;
		color: #666666;
	}
	.save-add{
		font-size: 40rpx;
	}
</style>
