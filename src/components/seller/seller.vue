<!--商家-->
<template>
  <div class="seller" ref="seller">
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc border-1px">
          <Star :size="36" :score="seller.score" class="star"></Star>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>元
            </div>
          </li>
        </ul>
        <div class="favorite" @click="toggleFavorite($event)">
          <span class="icon-favorite" :class="{'active':favorite}"></span>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div>
      <Split></Split>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper border-1px">
          <p class="content">{{seller.bulletin}}</p>
        </div>
        <ul v-if="seller.supports" class="support">
          <li class="support-item" v-for="(item,index) in seller.supports">
            <span class="icon" :class="classMap[seller.supports[index].type]">{{item.type}}</span>
            <span class="text">{{item.description}}</span>
          </li>
        </ul>
      </div>
      <Split></Split>
      <div class="pic">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" ref="picWrapper">
          <ul class="pic-list" ref="picList">
            <li class="pic-item" v-for="pic in seller.pics">
              <img :src="pic" alt="" width="120" height="90">
            </li>
          </ul>
        </div>
      </div>
      <Split></Split>
      <div class="info">
        <h1 class="title">商家信息</h1>
        <ul>
          <li class="info-item" v-for="(info,index) in seller.infos">{{info}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import Star from '../star/star.vue'
  import Split from '../split/split.vue'
  import {saveToLocal, loadFromLocal} from '../../common/js/store'

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        // 收藏
        favorite() {
          return loadFromLocal(this.seller.id, 'favorite', false);
        }
      }
    },
    computed: {
      favoriteText() {
        return this.favorite ? "已收藏" : "收藏";
      }
    },
    created() {
      this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special'];
    },
    //seller是异步获取，最开始的seller中什么也没有
    watch: {
      'seller': function () {
        this._initScroll();
        this._initPics();
      }
    },
    mounted() {
      this.$nextTick(() => {
        this._initScroll();
        this._initPics();
      })
    },
    methods: {
      // 初始化BScroll
      _initScroll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.seller, {
              click: true
            })
          } else {
            this.scroll.refresh();
          }
        })
      },
      //计算ul的宽度
      //最开始seller是空的没别加载，这个函数不会被执行
      //watch到seller变化后才开始执行
      _initPics: function () {
        if (this.seller.pics) {
          let picWidth = 120;
          let margin = 6;
          let width = (picWidth + margin) * this.seller.pics.length - margin;
          //给ul设置宽度
          this.$refs.picList.style.width = width + "px";
          //横向滚动
          this.$nextTick(() => {
            if (!this.Picscroll) {
              this.Picscroll = new BScroll(this.$refs.picWrapper, {
                scrollX: true,
                eventPassthrough: 'vertical'	//同时可以竖向滚动
              });
            } else {
              this.Picscroll.refresh();
            }
          });
        }
      },
      // 收藏按钮
      toggleFavorite(event) {
        if (!event._constructed) {
          return;
        }
        this.favorite = !this.favorite;
        // 向本地存储数据
        saveToLocal(this.seller.id, 'favorite', this.favorite);
      },
    },
    components: {
      Star,
      Split
    }
  }
</script>

<style lang="stylus">
  @import "../../common/stylus/mixin.styl"
  .seller
    position: absolute
    top: 174px
    bottom: 0
    left: 0
    width: 100%
    overflow: hidden
    .seller-content
      .overview
        padding: 18px
        position: relative
        .title
          line-height: 14px
          margin-bottom: 8px
          font-size: 14px
          color: rgb(7, 17, 27)
        .desc
          padding-bottom: 18px
          font-size: 0
          border-1px(rgba(7, 17, 27, 0.1))
          .star, .text
            display: inline-block
            color: rgb(77, 85, 93)
            line-height: 18px
          .star
            margin-right: 8px
            vertical-align: top
          .text
            margin-right: 12px
            font-size: 10px
        .remark
          display: flex
          padding-top: 18px
          .block
            flex: 1
            text-align: center
            border-right: 1px solid rgba(7, 17, 27, 0.1)
            &:last-child
              border: none
            h2
              margin-bottom: 4px
              line-height: 10px
              font-size: 10px
              color: rgb(147, 153, 159)
            .content
              height: 24px
              line-height: 24px
              .stress
                font-size: 24px
                font-weight: 200
                color: rbg(7, 17, 27)
        .favorite
          position: absolute
          width: 50px
          top: 18px
          right: 11px
          text-align: center
          .icon-favorite
            display: block
            line-height: 24px
            font-size: 24px
            color: #d6d6d9
            &.active
              color: rgb(240, 20, 20)
          .text
            line-height: 10px
            font-size: 10px
            color: rgb(77, 85, 93)
      .bulletin
        padding: 18px 18px 0 18px
        .title
          margin-bottom: 8px
          line-height: 14px
          font-size: 14px
          color: rgb(7, 17, 27)
        .content-wrapper
          padding-bottom: 16px
          border-1px(rgba(7, 17, 27, 0.1))
          .content
            line-height: 24px
            font-size: 12px
            font-weight: 200
            color: rgb(240, 20, 20)

        .support
          .support-item
            padding: 16px 12px
            border-1px(rgba(7, 17, 27, 0.1))
            font-size: 0
            &:last-child
              border: none
            .icon
              display: inline-block
              vertical-align: top
              width: 16px
              height: 16px
              margin-right: 6px
              background-size: 16px
              background-repeat: no-repeat
              &.decrease
                bg-image("decrease_4")
              &.discount
                bg-image("discount_4")
              &.guarantee
                bg-image("guarantee_4")
              &.invoice
                bg-image("invoice_4")
              &.special
                bg-image("special_4")
            .text
              line-height: 16px
              font-size: 12px
              font-weight: 200
              color: rbg(7, 17, 27)
      .pic
        padding: 18px
        .title
          margin-bottom: 12px
          line-height: 14px
          font-size: 14px
          color: rgb(7, 17, 27)
        .pic-wrapper
          width: 100%
          white-space: nowrap
          overflow: hidden
          .pic-list
            font-size: 0
            .pic-item
              display: inline-block
              width: 120px
              height: 90px
              margin-right: 6px
              &:last-child
                margin: 0
      .info
        padding: 16px
        .title
          line-height: 14px
          font-size: 14px
          color: rgb(7, 17, 27)
          padding-bottom: 12px
          border-1px(rgba(7,17,27,0.1))
        .info-item
          padding: 16px 12px
          line-height: 16px
          font-size: 12px
          font-weight: 200
          color:rgb(7,17,27)
          border-1px(rgba(7,17,27,0.1))


</style>
