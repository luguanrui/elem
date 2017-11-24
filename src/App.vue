<template>
  <!--最外层APP组件-->
  <div class="app">
    <div class="header">
      <!--header组件，通过props传入数据，seller对象-->
      <v-header v-bind:seller="seller"></v-header>
    </div>
    <div class="tab">
      <div class="tab-item border-1px">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <!--路由-->
    <router-view :seller="seller"></router-view>
  </div>
</template>

<script>
  //  引入header组件
  import header from 'components/header/header.vue'

  export default {
    data() {
      return {
        // 初始化变量seller
        seller: {}
      }
    },
    created() {
      //  获取数据vue-resource
      this.$http.get('/api/seller').then((response) => {
//        console.log(response);
        if (response.status === 200) {
          //  将获取到的数据赋值给变量seller
          this.seller = response.body;
//              console.log(this.seller);
        }

      })
    },
    // 注册组件
    components: {
      'v-header': header
    }
  }
</script>

<style lang="stylus">
  @import "./common/stylus/mixin.styl"
  .app
    .tab
      display: flex
      width: 100%
      height: 40px
      line-height: 40px
      border-1px(rgba(7, 17, 27, 0.1))
      .tab-item
        flex: 1
        text-align: center
        & > a
          display: block
          font-size: 14px
          color: rgb(77, 85, 93)
          &.active
            color: rgb(240, 20, 20)
</style>
