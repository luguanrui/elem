<template>
  <!--购物车组件-->
  <div class="shopcart">
    <div class="content">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo" :class="{hightlight:totalCount>0}">
            <span class="icon-shopping_cart"></span>
          </div>
          <div :class="{num:totalCount>0}">{{totalCount}}</div>
        </div>
        <div class="price" :class="{hightlight:totalCount>0}">￥{{totalPrice}}</div>
        <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
      </div>
      <div class="content-right">
        <div class="pay" :class="payClass">{{payDesc}}</div>
      </div>
    </div>
    <div class="ball-container">
      <transition-group name="drop" tag="div" v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:after-enter="afterEnter">
        <div v-for="(ball,index) in balls" :key="index" v-show="ball.show" class="ball">
          <div class="inner inner-hook"></div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  export default {
    props: {
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      },
      selectFoods: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    data() {
      return {
        balls: [
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        dropBalls: [],
        bus: new Vue()
      }
    },
    // 计算属性
    computed: {
      // 计算购买商品的总价
      totalPrice() {
        let total = 0;
        this.selectFoods.forEach((food) => {
          total += food.price * food.count;
        });
        return total;
      },
      // 所选商品的总和
      totalCount() {
        let count = 0;
        this.selectFoods.forEach((food) => {
          count += food.count;
        });
        return count;
      },
      // 计算还差多少钱起送
      payDesc() {
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}元起送`
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice;
          return `还差￥${diff}元起送`
        } else {
          return '去结算';
        }
      },
      // 去结算的class样式
      payClass() {
        if (this.totalPrice < this.minPrice) {
          return 'not-enough'
        } else {
          return 'enough'
        }
      }

    },
    // 方法属性
    methods: {
      //小球掉落的方法
      drop: function(el){
        for(let i = 0; i < this.balls.length; i++){
          let ball = this.balls[i];
          //找到一个隐藏的小球
          //把el赋给它。并填入dropBall中
          if( !ball.show ){
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      //进入动画前
      beforeEnter: function(el){
        let count = this.balls.length;
        while (count--){
          let ball = this.balls[count];
          //获得show=true小球对应的el的相对于视口的位置
          if (ball.show === true){
            let rect = ball.el.getBoundingClientRect();
            //小球起始点x,y与终点(购物车)的差值
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);
            el.style.display = '';
            //外层元素做一个纵向的动画
            el.style.webkitTransform = `translate3d(0, ${y}px, 0)`;
            el.style.transform = `translate3d(0, ${y}px, 0)`;
            //内部元素做一个横向动画
            let inner = el.getElementsByClassName("inner-hook")[0];
            inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`;
            inner.style.transform = `translate3d(${x}px, 0, 0)`;
          }
        }
      },
      //小球进入动画时
      enter: function(el){
        //重绘
        let rf = el.offsetHeight;
        this.$nextTick( () => {
          el.style.display = '';
          //外层元素做一个纵向的动画
          el.style.webkitTransform = 'translate3d(0, 0, 0)';
          el.style.transform = 'translate3d(0, 0, 0)';
          //内部元素做一个横向动画
          let inner = el.getElementsByClassName("inner-hook")[0];
          inner.style.webkitTransform = 'translate3d(0, 0, 0)';
          inner.style.transform = 'translate3d(0, 0, 0)';
        } )
      },
      //动画做完后
      //重置。小球又能重新用了
      afterEnter: function(el){
        let  ball = this.dropBalls.shift();
        if (ball){
          ball.show = false;
          el.style.display = 'none';
        }
      },
    },
    // 生命周期
    created() {
      //在整个goods页面下,shopcart和cartcontrol是兄弟
      this.$parent.bus.$on('cart-add', this.drop);
      //在shopcart中,shopcart是cartcontrol的父节点
      this.bus.$on('cart-add', this.drop)
    }
  }
</script>

<style lang="stylus">
  .shopcart
    position: fixed
    left: 0
    bottom: 0
    z-index: 50
    width: 100%
    height: 48px
    .content
      display: flex
      background: #141d27
      .content-left
        flex: 1
        font-size: 0
        .logo-wrapper
          display: inline-block
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          vertical-align: top
          border-radius: 50%
          background: #141d27
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            background: #2b343c
            text-align: center
            .icon-shopping_cart
              margin: 0 auto
              line-height: 44px
              font-size: 24px
              color: rgba(255, 255, 255, 0.4)
            &.hightlight
              background: rgb(0, 160, 220)
              .icon-shopping_cart
                color: #fff
          .num
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            border-radius: 16px
            font-size: 9px
            color: #fff
            background: rgb(240, 20, 20)
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
        .price, .desc
          display: inline-block
          vertical-align: top
          line-height: 24px
          margin-top: 12px
          padding-right: 12px
          border-sizing: border-box
          color: rgba(255, 255, 255, 0.4)
        .price
          font-size: 16px
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          font-weight: 700
          &.hightlight
            color: #fff
        .desc
          display: inline-block
          margin: 12px 0 0 12px
          font-size: 10px
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          height: 48px
          line-height: 48px
          text-align: center
          font-size: 12px
          color: rgba(255, 255, 255, 0.4)
          font-weight: 700
          &.not-enough
            background: #2b333b
          &.enough
            background: #00b43c
            color: #fff
    .ball-container
      .ball
        position: fixed
        left:32px
        bottom: 22px
        z-index: 50
        &.drop-enter-active
          transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
          .inner
            width: 16px
            height: 16px
            border-radius: 50%
            background-color: rgb(0, 160, 220)
            transition: all 0.4s linear

</style>
