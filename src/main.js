/**
 * 入口文件
 * 1. 引入相关的依赖，vue，vue-router,vue-resourse
 * 2. 引入最外层的vue组件，APP.vue
 * 3. 引入路由相关的组件good，rating，seller
 * 4. 通过Vue.use()实例化vue-router，vue-resource
 * 5. 创建路由
 * 6. 实例化vue
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import App from './App.vue'
import Goods from './components/goods/goods.vue'
import Ratings from './components/ratings/ratings.vue'
import Seller from './components/seller/seller.vue'

import './common/stylus/index.styl'

Vue.use(VueRouter);
Vue.use(VueResource);

Vue.config.productionTip = false;

// 定义路由
const routes = [
  {path: '/goods', component: Goods},
  {path: '/ratings', component: Ratings},
  {path: '/seller', component: Seller}
];

// 实例化路由
const router = new VueRouter({
  routes,
  linkActiveClass:'active'
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  router
})

