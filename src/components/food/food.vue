<!--商品详情-->
<template>
  <transition name="move">
    <div v-show="showFlag" class="food" ref="food">
      <div class="food-content">
        <!--图片-->
        <div class="image-header">
          <img :src="food.image" alt="详情">
          <div class="back">
            <i class="icon-arrow_lift" @click="hide"></i>
          </div>
        </div>
        <!--内容详情-->
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="nowPrice">￥{{food.price}}</span><span v-show="food.oldPrice" class="oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <CartControl :food="food"></CartControl>
          </div>
          <transition name="fade">
            <div @click.stop.prevent="addFirst($event)" class="buy" v-show="!food.count || food.count == 0">
              加入购物车
            </div>
          </transition>
        </div>
        <!--分割线-->
        <Split v-show="food.info"></Split>
        <!--商品介绍-->
        <div class="info" v-show="food.info">
          <h1 class="title">商品介绍</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <!--分割线-->
        <Split></Split>
        <!--商品评价-->
        <div class="rating1">
          <h1 class="title">商品评价</h1>
          <RatingSelect :select-type="selectType" :only-content="onlyContent" :desc="desc"
                        :ratings="food.ratings"></RatingSelect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li v-show="needShow(rating.rateType,rating.text)" v-for="(rating,index) in food.ratings" :key="index" class="rating-item border-1px">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img :src="rating.avatar" class="avator" alt="" width="12" height="12">
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import BScroll from 'better-scroll'
  import CartControl from '../cartcontrl/cartcontrl.vue'
  import Vue from 'vue'
  import Split from '../split/split.vue'
  import RatingSelect from '../ratingselect/ratingselect.vue'
  //带花括号引入的都是export function
  import {formatDate} from '../../common/js/common'

//  const POSITIVE = 0;
//  const NEGATIVE = 1;
  const ALL = 2;

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
        // 事件中心
        bus: new Vue(),
        // 选择类型（传递给ratingselect）
        selectType: ALL,
        // 是否显示内容（传递给ratingselect）
        onlyContent: true,
        // tab文本内容（传递给ratingselect）
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      }
    },
    // 方法属性
    methods: {
      // 父组件可以调用子组件的方法，goods组件中的ref=food,父组件控制food的显示
      show() {
        // 显示food组件
        this.showFlag = true;
        // 初始化selectType,onlyContent
        this.selectType = ALL;
        this.onlyContent = true;
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
      // 筛选评论按钮与下面的评论相关联
      needShow(type,text){
//        console.log(type,text)
        if(this.onlyContent && !text){
          return false;
        }
        if(this.selectType === ALL){
          return true;
        }else{
          return this.selectType = type;
        }
      },
    },
    // 过滤，时间格式化
    filters:{
      formatDate(time){
        let date = new Date(time);
        return formatDate(date,'YYYY-MM-DD hh:mm');
      }
    },
    created() {
      // food和shopcart是兄弟组件
//      this.bus.$on('cart-add',this.$parent.$refs.shopcart.drop);
      let that = this;
      this.bus.$on('ratingselect-type', function (type) {
        this.selectType = type;
          //因为改变数据，vue的dom更新是异步的
          //在修改数据之后因立即使用$nextTick
          that.$nextTick(() => {
            that.scroll.refresh();
          })

      });
      this.bus.$on('content-toggle', function(onlyContent){
        that.onlyContent = onlyContent;
        that.$nextTick(() => {
          that.scroll.refresh();
        })
      });
    },
    components: {
      CartControl,
      Split,
      RatingSelect
    }
  }
</script>

<style lang="stylus">
  @import "../../common/stylus/mixin.styl"
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
        position: relative
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
        .cartcontrol-wrapper
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
      .info
        padding: 18px
        .title
          margin-bottom: 8px
          line-height: 14px
          font-size: 14px
          font-weight: 700
          color: rgb(7, 17, 27)
        .text
          line-height: 24px
          font-size: 12px
          font-weight: 200
          color: rgb(77, 85, 93)
          padding: 0 8px
      .rating1
        padding: 18px
        .title
          margin-bottom: 8px
          line-height: 14px
          font-size: 14px
          font-weight: 700
          color: rgb(7, 17, 27)
        .rating-wrapper
          padding: 0 18px
          .rating-item
            position: relative
            padding: 16px 0
            border-1px: rgba(7, 17, 27, 0.1)
            .user
              position: absolute
              right: 0
              top: 16px
              font-size: 0
              line-height: 12px
              .name
                display: inline-block
                vertical-align: top
                margin-right: 16px
                color: rgb(147, 153, 159)
                font-size: 10px
              .avator
                border-radius: 50%
            .time
              line-height: 12px
              margin-bottom: 6px
              font-size: 10px
              color: rgb(147, 153, 159)
            .text
              line-height: 16px
              font-size: 12px
              color: rgb(7, 17, 27)
              .icon-thumb_up, .icon-thumb_down
                margin-right: 4px
                line-height: 16px
                font-size: 12px
              .icon-thumb_up
                color: rgb(0, 160, 220)
              .icon-thumb_down
                color: rgb(147, 153, 159)

          .no-rating
            padding: 16px 0
            font-size: 12px
            color: rgb(147, 153, 159)
</style>
