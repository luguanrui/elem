<!--商品评论-->
<template>
  <div class="ratingselect">
    <div class="rating-type border-1px">
      <span @click="select(2,$event)" class="block positive" :class="{active:selectType1 === 2}">
        {{desc.all}}
        <span class="count">{{ratings.length}}</span>
      </span>
      <span @click="select(0,$event)" class="block positive" :class="{active:selectType1 === 0}">
        {{desc.positive}}
        <span class="count">{{positives.length}}</span>
      </span>
      <span @click="select(1,$event)" class="block negative" :class="{active:selectType1 === 1}">
        {{desc.negative}}
        <span class="count">{{negatives.length}}</span>
      </span>
    </div>
    <div @click="toggleContent($event)" class="switch" :class="{on:onlyContent1}">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script>
  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2;
  export default {
    props: {
      ratings: {
        type: Array,
        default() {// 对象和数组的返回是一个函数default()
          return []
        }
      },
      selectType: {
        type: Number,
        default: ALL
      },
      onlyContent: {
        type: Boolean,
        default: false
      },
      desc: {
        type: Object,
        default() {
          return {
            all: '全部',
            positive: '推荐',
            negative: '吐槽'
          }
        }
      }
    },
    data() {
      return {
        selectType1: this.selectType,
        onlyContent1: this.onlyContent
      }
    },
    computed: {
      //过滤出推荐和吐槽的评价
      //这个组件中是为了要显示他们的数量
      positives() {
        return this.ratings.filter((rating) => {
          return rating.rateType === POSITIVE;
        })
      },
      negatives() {
        return this.ratings.filter((rating) => {
          return rating.rateType === NEGATIVE;
        })
      }
    },
    methods: {
      // 选中tab，但是父元素并没有改变，所以子组件要通知父组件发生了变化，所以需要派发一个事件
      select(type, event) {
        if (!event._constructed) {
          return;
        }
        this.selectType1 = type;
        // 通知父组件发生变化,父组件通过$on来监听子组件的变化
        this.$parent.bus.$emit('ratingtype-select', type);
      },
      // 切换
      toggleContent(event) {
        if (!event._constructed) {
          return;
        }
        this.onlyContent1 = !this.onlyContent1;
//        this.$parent.bus.$emit('content-toggle', this.onlyContent1);
      }
    }
  }
</script>

<style lang="stylus">
  @import '../../common/stylus/mixin.styl'
  .ratingselect
    .rating-type
      padding: 18px 0
      margin: 0 18px
      border-1px(rgba(7, 17, 27, 0.1))
      font-size: 0
      .block
        display: inline-block
        padding: 18px 12px
        margin-right: 8px
        border-radius: 1px
        font-size: 12px
        color: rgb(77, 85, 93)
        &.active
          color: #fff
        .count
          line-height: 12px
          font-size: 8px
          margin-left: 2px
        &.positive
          background: rgba(0, 160, 220, 0.2)
          &.active
            background: rgb(0, 160, 220)
        &.negative
          background: rgba(77, 85, 93, 0.2)
          &.active
            background: rgb(77, 85, 93)
    .switch
      padding: 12px 18px
      line-height: 24px
      border-bottom: 1px solid rgba(7, 17, 27, 0.1)
      color: rgb(147, 153, 159)
      font-size: 0
      &.on
        .icon-check_circle
          color: #00c850
      .icon-check_circle
        display :inline-block
        vertical-align :top
        margin-right: 4px
        font-size: 24px
      .text
        font-size: 12px
</style>
