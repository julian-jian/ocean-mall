<template>
	<view class="page-container">
		<image src="../../static/img/ranking-banner.jpeg" mode="widthFix" class="banner"></image>
		<image :src="item.img" mode="widthFix" class="banner" v-for="(item, index) in banner" :key="index"></image>
		<view class="container">
			<view>
				<text>排名</text>
				<text>用户名</text>
				<text>本月消费</text>
				<text>本月段位</text>
				<text>历史海王次数</text>
			</view>
			<view v-for="(item, index) in list" :key="index">
				<view><image :src="item.icon" mode=""></image></view>
				<view>{{ item.nickname }}</view>
				<view>{{ item.currentMonthConsumption }}</view>
				<view><image :src="item.currentMonthRankIcon" mode=""></image></view>
				<view class="idx">
					<view>{{ item.historyNumIcon }}</view>
					<image :src="ranking_bg" mode=""></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			list: [],
			banner: [],
			ranking_bg: ''
		};
	},
	onLoad() {
		this.$http.get('/home/getBanner/3').then(res => {
			this.banner = res.data.data;
		});
		this.$http.get('/home/getBanner/5').then(res => {
			this.ranking_bg = res.data.data[0].img;
		});
		this.getList();
	},
	methods: {
		getList() {
			this.$http.get('/home/getLadderList').then(res => {
				this.list = res.data.data;
				console.log(this.list);
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
	background: linear-gradient(0deg, #f15037, #f53146);
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
		height: 11.85vw;
		display: flex;
		align-items: center;
		justify-content: space-evenly;
		font-size: 3.33vw;

		> text {
			flex: 1;
			color: #999999;
			text-align: center;
		}

		> view {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			text-align: center;

			> text {
				width: 100%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			image {
				width: 6.46vw;
				height: 6.46vw;
			}
		}

		> view:last-child,
		> text:last-child {
			flex: 1.3;
		}

		.idx {
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;

			> view {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
				color: white;
				z-index: 10;
			}
		}
	}

	> view:nth-child(2n) {
		background: #e9e7f9;
		// height: 7.41vw;
	}
}
</style>
