<template>
	<view class="page-container">
		<image :src="item.img" mode="widthFix" class="banner" v-for="(item, index) in banner" :key="index"></image>
		<view class="container">
			<view>
				<text>排名</text>
				<text>用户名</text>
				<text>总积分</text>
			</view>
			<view v-for="(item, index) in list" :key="index">
				<view><image :src="item.icon" mode=""></image></view>
				<view>{{ item.nickname }}</view>
				<view>{{ item.pointCount || 0 }}</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			list: [],
			banner: []
		};
	},
	onLoad() {
		this.$http.get('/home/getBanner/4').then(res => {
			this.banner = res.data.data;
		});
		this.getList();
	},
	methods: {
		getList() {
			this.$http.get('/home/getLeagueTable').then(res => {
				this.list = res.data.data;
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.page-container {
	width: 100%;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	/* #ifdef H5 */
	min-height: calc(100vh - 44px);
	/* #endif */
	background: linear-gradient(90deg, #a08b48, #b89c4a);
}

.banner {
	width: 100%;
}

.container {
	width: 94.63vw;
	display: flex;
	flex-direction: column;
	background: white;
	border-radius: 3vw;
	margin-top: 9.53vw;
	margin-bottom: 10.9vw;
	overflow: hidden;
	box-shadow: 0 1vw 3vw 0 rgba(79, 56, 156, 0.34);

	> view {
		width: 100%;
		height: 11.6vw;
		display: flex;
		align-items: center;
		justify-content: space-evenly;
		font-size: 3.73vw;
		color: #626262;

		> text {
			flex: 1;
			text-align: center;
			font-size: 4vw;
		}

		> view {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			text-align: center;

			> image {
				width: 6.46vw;
				height: 6.46vw;
			}
		}
	}

	> view:nth-child(2n) {
		background: #f6f9f8;
	}
}
</style>
