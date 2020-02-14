// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from "axios"
import store from "./store/store"

import VueAwesomeSwiper from 'vue-awesome-swiper'
import '../node_modules/swiper/css/swiper.css'
Vue.use(VueAwesomeSwiper)
// 轮播图的插件

import attachFastClick from "fastclick" //引入fastclick解决移动端300ms延迟问题
import "./assets/stylus/index.styl" //引入 主stylus文件
attachFastClick.attach(document.body)//把该插件作用于整个body上

Vue.config.productionTip = false //阻止启动生产消息

//上传服务器的时候改变的地址
axios.defaults.baseURL = 'http://localhost:3389';

Vue.prototype.$axios = axios//axios挂载vue原型上


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store
})
