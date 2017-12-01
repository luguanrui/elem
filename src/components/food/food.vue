<!--商品详情-->
<template>
  <transition name="move">
    <div v-show="showFlag" class="food" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image" alt="详情">
          <div class="back">
            <i class="icon-arrow_lift" @click="hide"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="nowPrice">￥{{food.price}}</span><span v-show="food.oldPrice" class="oldPrice">￥{{food.oldPrice}}</span>
          </div>
        </div>
        <div class="cartControl-wrapper">
          <CartControl :food="food" :bus="bus"></CartControl>
        </div>
        <transition name="fade">
          <div @click.stop.prevent="addFirst($event)" class="buy" v-show="!food.count || food.count == 0">
            加入购物车
          </div>
        </transition>
      </div>
    </div>
  </transition>
</template>

<script>
  import BScroll from 'better-scroll'
  import CartControl from '../cartcontrl/cartcontrl.vue'
  import Vue from 'vue'

  export default {
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {
        // 默认显示是false
        showFlag: false,
        bus: new Vue()
      }
    },
    // 方法属性
    methods: {
      // 父组件可以调用子组件的方法，goods组件中的ref=food,父组件控制food的显示
      show() {
        this.showFlag = true;
        // 使用better-scroll 不显示滚动条
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.food, {
              click: true
            })
          } else {
            this.scroll.refresh();
          }
        })
      },
      // 返回按钮，隐藏food组件
      hide() {
        this.showFlag = false;
      },
      // 加入购物车
      addFirst(event) {
        // 防止pc多次点击
        if (!event._constructed) {
          return;
        }
        // 点击购物车，出现小球动画
        this.$parent.bus.$emit('cart-add', event.target);
        Vue.set(this.food, "count", 1)
      },
    },
    components: {
      CartControl
    }
  }
</script>

<style lang="stylus">
  @import '../../common/stylus/mixin.styl'
  .food
    position: fixed
    left: 0
    top: 0
    bottom: 48px
    z-index: 30
    width: 100%
    background: #fff
    transform: translate3d(0, 0, 0)
    &.move-enter-active, &.move-leave-active
      transition: all 0.4s linear
    &.move-enter, &.move-leave-active
      transform: translate3d(100%, 0, 0)
    .food-content
      .image-header
        position: relative
        width: 100%
        height: 0
        padding-top: 100%
        img
          position: absolute
          top: 0
          left: 0
          width: 100%
          height: 100%
        .back
          position: absolute
          top: 10px
          left: 0
          .icon-arrow_lift
            display: block
            padding: 10px
            font-size: 20px
            color: #fff

      .content
        padding: 18px
        border-1px: rgba(7, 17, 27, 0.1)
        .title
          margin-bottom: 8px
          line-height: 14px
          font-size: 14px
          font-weight: 700
          color: rgb(7, 17, 27)
        .detail
          margin-bottom: 18px
          line-height: 10px
          font-size: 0
          .sell-count, .rating
            font-size: 10px
            color: rgb(147, 153, 159)
          .sell-count
            margin-right: 12px
        .price
          line-height: 24px
          .nowPrice
            font-size: 14px
            color: rgb(240, 20, 20)
            font-weight: 700
            margin-right: 8px
          .oldPrice
            text-decoration line-through
            font-size: 10px
            color: rgb(147, 153, 159)

      .cartControl-wrapper
        position: absolute
        right: 12px
        bottom: 12px
      .buy
        position: absolute
        right: 18px
        bottom: 18px
        z-index: 10
        height: 24px
        line-height: 24px
        padding: 0 12px
        box-sizing: border-box
        font-size: 10px
        color: #fff
        background: rgb(0, 160, 220)
        border-radius: 12px
        &.fade-enter-active, &.fade-leave-active
          transition: all 0.2s
        &.fade-enter, &.fade-enter-active
          transition: opacity 0
</style>
