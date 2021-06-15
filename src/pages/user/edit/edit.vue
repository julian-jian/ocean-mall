<template>
	<view class="edit" id="edit">
		<hxNavbar :fixed="true" :back="true" title="我的地址" color="#FFFFFF">
		</hxNavbar>
		<view class="details">
			<input class="name" v-model="modelData.name" />
			<input class="iphone" v-model="modelData.phoneNumber" />
			<view class="siteMessage" @click="addressShow = true">
				{{siteMessage.province}}{{siteMessage.city}}{{siteMessage.area}}
				<pickerAddress v-model="addressShow" @confirm="addresspick" />
			</view>
			<input class="siteDetails" v-model="modelData.detailAddress" />
		</view>
		<view class="bottom-btn" @click="saveBtn()">
			<view class="save-btn">
				保存
			</view>
		</view>
	</view>
</template>

<script>
	import pickerAddress from '@/components/ocean-pickerAddress/index.vue'
	import {
		getUpdate
	} from '@/api/user/address.js'
	export default {
		data() {
			return {
				data: {},
				siteMessage: {
					province: '',
					city: '',
					area: ''
				},
				addressShow: false,
				form: {
					province: '',
					city: '',
					area: '',
				},
				modelData: {
					city: "",
					defaultStatus: "",
					detailAddress: "",
					id: "",
					memberId: "",
					name: "",
					phoneNumber: "",
					province: "",
					region: "",
				}
			}
		},
		onLoad: function(option) {
			// 拿到上个页面的信息
			let item = JSON.parse(decodeURIComponent(option.item))
			this.data = item
			console.log(this.data, this.siteMessage);
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
			async saveBtn() {
				let address={
					detailAddress:this.modelData.detailAddress,
					name:this.modelData.name,
					phoneNumber:this.modelData.phoneNumber,
					province:this.siteMessage.province,
					city:this.siteMessage.city,
					region:this.siteMessage.area.length!=0?this.siteMessage.area:'',
					defaultStatus:this.modelData.defaultStatus
				}
				let res = await getUpdate(address,this.data.id)
				if(res.data.code === 200) {
					uni.navigateBack();
					uni.showToast({
					    title: '保存成功',
					    duration: 2000,
						icon: 'none'
					});
				}
				console.log(res);
			},
			modeldate() {
				this.modelData.city = this.data.city
				this.modelData.defaultStatus = this.data.defaultStatus
				this.modelData.detailAddress = this.data.detailAddress
				this.modelData.id = this.data.id
				this.modelData.province = this.data.province
				this.modelData.name = this.data.name
				this.modelData.phoneNumber = this.data.phoneNumber
				this.modelData.region = this.data.region
				this.siteMessage.province = this.data.province
				this.siteMessage.city = this.data.city
				this.siteMessage.area = this.data.region
			}
		},
		mounted() {
			this.modeldate()
			console.log(this.modeldate);
		},
		components: {
			pickerAddress
		}
	}
</script>

<style lang="scss">
	.edit {
		width: 750rpx;
		height: 100vh;

		.details {
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

		.bottom-btn {
			position: fixed;
			bottom: 0;
			width: 750rpx;
			height: 97rpx;
			line-height: 97rpx;
			text-align: center;
			background: #666666;
			box-shadow: 0px 0px 9px 0px rgba(119, 119, 119, 0.28);

			.save-btn {
				width: 100%;
				height: 100%;
				font-size: 36rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(255, 255, 255, 1);
			}
		}
	}
</style>
