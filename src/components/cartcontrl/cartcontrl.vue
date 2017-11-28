<template>
  <!--购物车控制组件-->
  <div class="cartcontrl">
    <transition name="move">
      <div class="cart-decrease" v-show="food.count>0" @click="decreaseCart($event)">
       <span v-show="food.count>0" class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click="addCart($event)"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  // 引入vue，使用全局接口Vue.set，用于避开 Vue 不能检测属性被添加的限制
  import Vue from 'vue'
  export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      // 添加商品到购物车
      addCart(event) {
        if (!event._constructed) {
          return;
        }
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1);
        } else {
          this.food.count++;
        }

        // 派发事件，传入参数
//        console.log(this.$parent.bus);
        this.$parent.bus.$emit('cart-add', event.target);
      },
      // 减少商品
      decreaseCart(event) {
        if (!event._constructed) {
          return;
        }
        if (this.food.count) {
          this.food.count--;
        }
      }
    }
  }
</script>

<style lang="stylus">
  .cartcontrl
    font-size: 0
    .cart-decrease
      display: inline-block
      padding: 6px
      .inner
        line-height: 24px
        font-size: 24px
        color: rgb(0, 160, 220)
      &.move-enter-active, &.move-leave-active
        transition: all 0.4s linear
        .inner
          display: inline-block
          transition: all 0.4s linear
      &.move-enter, &.move-leave-active
        opacity: 0
        transform: translate3d(24px, 0, 0)
        .inner
          transform: rotate(180deg)
    .cart-count
      display: inline-block
      vertical-align: top
      width: 12px
      padding-top: 6px
      line-height: 24px
      text-align: center
      font-size: 10px
      color: rgb(147, 153, 159)
    .cart-add
      display: inline-block
      line-height: 24px
      font-size: 24px
      padding: 6px
      color: rgb(0, 160, 220)
</style>
