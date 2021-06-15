<template>
  <view class="login global-Header-Color">
    <hxNavbar :back="true" :fixed="true" title="用户登陆" color="#ffffff" />
    <view class="login-box ">
      <view class="image-box"
        ><image src="@/static/img/logo1.png" mode="" class="login-image"></image
      ></view>
      <view class="text-box"
        ><text class="login-text">欢迎登陆智海海洋商城</text></view
      >
      <view class="btn-box">
        <button
          class="login-btn"
          open-type="getUserInfo"
          @getuserinfo="getUserInfo"
        >
          <view class="set-btn">
            <image src="@/static/img/weixin1.png" mode=""></image>
            微信手机号登陆
          </view>
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import { getLogin } from "../../../api/main/login.js";
import { getPeopleInfo } from "../../../api/user/user.js";
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {};
  },
  methods: {
    ...mapMutations("user", [
      "setLoginCode",
      "setLoginstate",
      "setLoginToken",
      "setUserInfo",
    ]),
    //获取用户信息
    getUserInfo(res) {
      uni.showLoading({
        title: "加载中",
      });
      // 判断是否登录
      wx.checkSession({
        success: (result) => {
          getLogin({
            code: this.loginCode,
            encrypteData: res.detail.encryptedData,
            iv: res.detail.iv,
            rawData: res.detail.rawData,
            signature: res.detail.signature,
          })
            .then((data) => {
              this.setLoginstate(true);
              uni.hideLoading();
              this.setLoginToken(data.data.data.token);
              uni.setStorage({
                key: "loginState",
                data: true,
              });
              uni.setStorage({
                key: "token",
                data: data.data.data.token,
                success: async () => {
                  let userInfo = await getPeopleInfo();
                  this.setUserInfo(userInfo.data.data);
                  uni.setStorage({
                    key: "userInfo",
                    data: userInfo.data.data,
                  });
                },
              });
              this.$store.state.user.hasLogin = true;
              console.log(this.$store.state.user.hasLogin);
              uni.navigateBack({});
            })
            .catch((error) => {
              uni.hideLoading();
              uni.showToast({
                duration: 800,
                icon: "none",
                title: "登陆失败",
              });
            });
        },
        fail: (error) => {
          uni.hideLoading();
        },
      });
    },
    // 判断本地是否存在code
    judgeLoginCode() {
      this.setLoginCode();
    },
  },
  computed: {
    ...mapState("user", ["loginCode"]),
  },
  mounted() {},
  onLoad() {
    // 本地测试
    this.judgeLoginCode();
  },
};
</script>

<style lang="scss">
.login {
  width: 750rpx;
  height: 100vh;
  position: relative;
}
.login-box {
  position: absolute;
  top: 48%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 650rpx;
  .image-box {
    width: 650rpx;
    .login-image {
      display: block;
      height: 179rpx;
      width: 185rpx;
      margin: 0 auto;
    }
  }
  .text-box {
    width: 650rpx;
    text-align: center;
    .login-text {
      font-size: 30rpx;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.8);
      line-height: 60rpx;
    }
  }
  .btn-box {
    margin-top: 80rpx;
    .login-btn {
      background: rgba(53, 170, 94, 1);
      border-radius: 5rpx;
      font-size: 30rpx;
      font-weight: 500;
      height: 90rpx;
      line-height: 90rpx;
      color: rgba(255, 255, 255, 1);
    }
    .set-btn {
      height: 90rpx;
      display: inline-block;
      image {
        display: inline-block;
        height: 34rpx;
        width: 41rpx;
        float: left;
        margin: 28rpx 12rpx;
      }
    }
  }
}
</style>
