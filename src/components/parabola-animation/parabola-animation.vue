<template>
	<view>
		<view :animation="animationY" :style="'position:fixed;top:' + ballY + 'px;'" v-if="showBall">
			<view class="ball" :animation="animationX" :style="'position:fixed;left:' + ballX + 'px;'"></view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				rightListSum: [
					{
						showDel: false,
						delAnimation: false, // 删除动画
						sum: 0,
					}
				],
				showShoppingCart: true, // 购物车显示
				shoppingCartAnimation: false, // 购物车动画
				showBall: false, // 小球是否显示
				animationY: '', // 动画Y
				animationX: '', // 动画X
				ballY: '', // 小球当前位置Y
				ballX: '', // 小球当前位置X
			};
		},
		onLoad(option) {
			console.log('onLoad')
			this.calculateHeight()
		},
		onReady() {
			// 接口返回
			// this.calculateHeight()
		},
		onShow() {
		},
		methods: {
			// 添加购物车
			addShoppingCard(e){
				console.log(e)
				let index = e.currentTarget.dataset.index
				this.rightListSum[index].sum = this.rightListSum[index].sum + 1
				this.rightListSum[index].delAnimation = true
				this.rightListSum[index].showDel = true
				// x, y表示手指点击横纵坐标, 即小球的起始坐标
				let ballX = e.detail.x,
					ballY = e.detail.y;
				this.createAnimation(ballX, ballY);
			},
			// 延迟执行
			setDelayTime(sec) {
				return new Promise((resolve, reject) => {
					setTimeout(() => {resolve()}, sec)
				});
			},
			// 创建动画
			createAnimation(ballX, ballY) {
				uni.getSystemInfo({
					success: async (e) => {
						// var bottomX = e.windowWidth; // 结束位置X
						var bottomX = 50; // 结束位置X
						var bottomY = e.windowHeight - 50; // 结束位置Y
						var animationX = this.flyX(bottomX, ballX); // 创建小球水平动画
						var animationY = this.flyY(bottomY, ballY); // 创建小球垂直动画
						this.ballX = ballX; // 小球当前位置X
						this.ballY = ballY; // 小球当前位置Y
						this.showBall = true; // 显示小球
						
						this.setDelayTime(100).then(() => {
							this.animationX = animationX.export(); // 执行动画X
							this.animationY = animationY.export(); // 执行动画Y
							// 400ms延时, 即小球的抛物线时长
							return this.setDelayTime(400);
						}).then(() => {
							this.animationX = this.flyX(0, 0, 0).export(); // 执行动画X
							this.animationY = this.flyY(0, 0, 0).export(); // 执行动画Y
							this.showBall = false; // 隐藏小球
							this.shoppingCartAnimation =  true // 购物车动画
							// 400ms延时, 即小球的抛物线时长
							return this.setDelayTime(400);
						}).then(() => {
							this.shoppingCartAnimation =  false // 购物车动画
						})
						
					}
				})
			},
	
		}
	}
</script>

<style>

</style>
