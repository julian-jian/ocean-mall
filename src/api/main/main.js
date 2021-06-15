import http from "../../utils/http.js";
// // 导入请求插件
// import Requests from '../../utils/request/index.js';

// // 实例初始化
// const https = new Requests();

// // 设置默认参数
// https.setConfig((config)=>{
// 	// config.baseURL = 'https://app.zhihaiocean.com/portal/api';
// 	// config.baseURL = 'https://b.hapondtech.com/api';
// 	// config.baseURL = 'http://118.24.13.29:8081';// 测试使用的地址
// 	// config.baseURL = 'http://192.168.199.102:8081';
// 	// config.baseURL = 'http://127.0.0.1:8081';
// 	config.baseURL = 'http://192.168.8.155:8081';
// 	return config
// })
// 获取banner轮播图
export const getBanner = () => { 
  return http.request({
    url: "/home/banner",
    method: "GET",
    success: (res) => {
      if (res.code !== 200) {
        uni.setStorage({
          key: "homeStatus",
          data: "0",
        });
      }
    },
    fail: () => {
      uni.setStorage({
        key: "homeStatus",
        data: "0",
      });
    },
  });
};

// 获取温馨提示
export const getRemind = () => {
  return http.request({
    url: "/home/remind",
    method: "GET",
  });
};

// 获取商品分类的数据
export const productCateList = () => {
  return http.request({
    url: "/home/productCateList",
    method: "GET",
    success: (res) => {
      if (res.code !== 200) {
        uni.setStorage({
          key: "homeStatus",
          data: "0",
        });
      }
    },
    fail: () => {
      uni.setStorage({
        key: "homeStatus",
        data: "0",
      });
    },
  });
};

// 获取猜你喜欢的商品数据
export const newProductList = (obj) => {
  return http.request({
    url: "/home/newProductList",
    method: "GET",
    data: obj,
    success: (res) => {
      if (res.code !== 200) {
        uni.setStorage({
          key: "homeStatus",
          data: "0",
        });
      }
    },
    fail: () => {
      uni.setStorage({
        key: "homeStatus",
        data: "0",
      });
    },
  });
};

// 获取猜特价商品数据
export const hotProductList = (obj) => {
  return http.request({
    url: "/home/hotProductList",
    method: "GET",
    data: obj,
  });
};

// 获取商品详情
export const productDetail = (id) => {
  return http.request({
    url: `/product/detail/${id}`,
    method: "GET",
  });
};
// 获取商品详情二维码
export const getDetailQrCode = (path, id) => {
  return http.request({
    url: `/qr/qrCode`,
    method: "POST",
    data: {
      path: path,
      productId: id,
      scene: "data=" + id,
      width: "143",
    },
  });
};

// 获取随机推荐的东西
export const getRandProduct = (id) => {
  return http.request({
    url: `/product/getRandProduct/${id}`,
    method: "GET",
  });
};

// 获取积分的接口
export const pointProductList = (obj) => {
  return http.request({
    url: `/point/pointProductList`,
    method: "GET",
    data: obj,
  });
};

// 加入购物车接口
export const addShoppingCart = (obj) => {
  return http.request({
    method: "POST",
    url: `/cart/add`,
    data: obj,
  });
};

// 收藏商品的接口
export const addCollectList = (obj) => {
  return http.request({
    method: "POST",
    url: `/member/productCollection/add`,
    data: obj,
  });
};

// 判断是否在购物车中
export const existStatus = (id) => {
  return http.request({
    method: "GET",
    url: `/cart/existStatus/${id}`,
  });
};

// 判断是否在收藏中
export const isCollet = (id) => {
  return http.request({
    method: "GET",
    url: `/member/productCollection/detail`,
    data: {
      productId: id,
    },
  });
};

// 取消收藏
export const closeCollerList = (id) => {
  return http.request({
    method: "POST",
    url: `/member/productCollection/delete`,
    data: id,
  });
};

// 取消 购物车
export const closeCartList = (id) => {
  return http.request({
    method: "POST",
    url: `/cart/delete`,
    params: {
      ids: id,
    },
  });
};

//获取用户自身的积分
export const getPoint = () => {
  return http.request({
    method: "GET",
    url: "/sso/getPoint",
  });
};
