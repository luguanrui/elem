<template>
  <div class="rating" ref="ratings">
    <div class="rating-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <Star :size="36" :score="seller.serviceScore" class="star"></Star>
            <span>{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <Star :size="36" :score="seller.serviceScore" class="star"></Star>
            <span>{{seller.serviceScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <Split></Split>
      <RatingSelect :ratings="ratings" :selectType="selectType" :onlyContent="onlyContent"></RatingSelect>
      <div class="rating-wrapper">
        <ul>
          <li v-show="needShow(rating.rateType,rating.text)" v-for="(rating,index) in ratings" :key="index"
              class="rating-item border-1px">
            <div class="avatar">
              <img :src="rating.avatar" alt="" width="28" height="28">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score" class="star"></star>
                <span v-show="rating.deliveryTime" class="delivery">{{rating.deliveryTime}}分钟送到</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend && rating.recommend.length!==0">
                <span class="icon-thumb_up"></span>
                <span v-for="(item,index) in rating.recommend" :key="index" class="item">{{item}}</span>
              </div>
              <div class="time">{{rating.rateTime | formatDate}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Star from '../star/star.vue'
  import Split from '../split/split.vue'
  import RatingSelect from '../ratingselect/ratingselect.vue'
  import BScroll from 'better-scroll'
  import Vue from 'vue'
  import {formatDate} from '../../common/js/common'

  const ALL = 2;

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        ratings: [],
        selectType: ALL,
        onlyContent: true,
        bus: new Vue()
      }
    },
    methods: {
      needShow(type, text) {
        if (this.onlyContent && !text) {
          return false;
        }
        if (this.selectType === ALL) {
          return true;
        } else {
          this.selectType = type;
        }
      }
    },
    filters:{
      formatDate(time){
        let date = new Date(time)
        return formatDate(date,'YY-MM-DD hh:mm');
      }
    },
    created() {
      this.$http.get('/api/ratings').then((response) => {
        if (response.status === 200) {
          this.ratings = response.body;
        }
        this.$nextTick(() => {
          this.scroll = new BScroll(this.$refs.ratings, {
            click: true
          })
        })
      });

      let that = this;
      //ratingselect组件派发的事件
      this.bus.$on('ratingtype-select', function(type){
        that.selectType = type;
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
      Star,
      Split,
      RatingSelect
    }
  }
</script>

<style lang="stylus">
  @import "../../common/stylus/mixin.styl"
  .rating
    position: absolute
    top: 170px
    bottom: 0
    left: 0
    width: 100%
    overflow: hidden
    .rating-content
      .overview
        display: flex
        padding: 18px 0
        .overview-left
          flex: 0 0 137px
          padding: 6px 18px
          width: 137px
          border-right: 1px solid rgba(7, 17, 27, 0.1)
          text-align: center
          @media only screen and (max-width: 320px)
            flex: 0 0 120px
            width: 120px
          .score
            line-height: 28px
            margin-bottom: 6px
            font-size: 24px
            color: rgb(255, 153, 0)
          .title
            line-height: 12px
            margin-bottom: 8px
            font-size: 12px
            color: rgb(7, 17, 27)
          .rank
            line-height: 10px
            margin-bottom: 6px
            height: 10px
            color: rgb(147, 153, 159)
        .overview-right
          flex: 1
          padding: 6px 0 6px 24px
          @media only screen and (max-width: 320px)
            padding-left: 6px
          .score-wrapper
            margin-bottom: 8px
            font-size: 0
            .title
              display: inline-block
              vertical-align: top
              line-height: 18px
              font-size: 12px
              color: rgb(7, 17, 27)
            .star
              display: inline-block
              vertical-align: top
              margin: 0 12px
          .delivery-wrapper
            font-size: 0
            .title, .delivery
              display: inline-block
              line-height: 18px
              font-size: 12px
              color: rgb(7, 17, 27)
            .title
              margin-right: 12px
              color: rgb(7, 17, 27)
            .delivery
              color: rgb(147, 153, 159)
      .rating-wrapper
        padding: 0 18px
        .rating-item
          display: flex
          padding: 18px 0
          border-1px(rgba(7, 17, 27, 0.1))
          .avatar
            flex: 0 0 28px
            width: 28px
            margin-right: 12px
            img
              border-radius: 50%
          .content
            flex: 1
            position: relative
            .name
              margin-bottom: 4px
              line-height: 12px
              font-size: 10px
              color: rgb(7, 17, 27)
            .star-wrapper
              font-size: 0
              margin-bottom: 6px
              .star, .delivery
                display: inline-block
              .star
                margin-right: 6px
                vertical-align: top
              .delivery
                line-height: 12px
                vertical-align: top
                font-size: 10px
                font-weight: 200
                color: rgb(147, 153, 159)
            .text
              margin-bottom: 8px
              line-height: 18px
              font-size: 12px
              color: rgb(7, 17, 27)
            .recommend
              line-height: 16px
              font-size: 0
              .icon-thumb_up, .item
                display: inline-block
                margin: 0 8px 4px 0
                line-height: 16px
                font-size: 9px
              .icon-thumb_up
                color: rgb(0, 160, 220)
              .item
                padding: 0 6px
                border: 1px solid rgba(7, 17, 27, 0.1)
                border-radius: 1px
                color: rgb(147, 153, 159)
                background-color: #fff
            .time
              position:absolute
              top: 0
              right:0
              line-height: 12px
              font-size:10px
              color: rgb(147,153,159)
</style>
