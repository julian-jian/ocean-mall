import Vue from 'vue'
import App from './App'
import hxNavbar from '@/components/ocean-navbar/hx-navbar.vue';
// import boxScroll from '@/components/box-scroll/box-scroll.vue';
import easyimage from '@/components/easy-cacheimage/easy-cacheimage.vue'
import toast from '@/components/ocean-toast/tui-toast.vue';
import tuiModal from '@/components/ocean-modal/tui-modal.vue';
import utils from './utils/utils.js'
import store from './store'
import $http from './utils/http.js'
import share from './utils/share.js'

Vue.config.productionTip = false
Vue.component('hxNavbar',hxNavbar)
// Vue.component('boxScroll',boxScroll)
Vue.component('toast',toast)
Vue.component('tuiModal',tuiModal)
Vue.component('easyimage',easyimage)
Vue.prototype.$store = store
Vue.prototype.$http=$http
Vue.prototype.$utils=utils
Vue.mixin(share)

// store.commit('pleaseGoLogin')

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
