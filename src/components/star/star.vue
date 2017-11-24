<!--星星组件-->
<template>
  <div class="star" :class="starType">
    <span v-for="(itemClass,index) in itemClasses" :key="index" :class="itemClass" class="star-item"></span>
  </div>
</template>

<script type="text/ecmascript-6">

  // 星星的长度
  const LENGTH = 5;
  // class on
  const CLS_ON = 'on';
  // class half
  const CLS_HALF = 'half';
  // class off
  const CLS_OFF = 'off';

  export default {

    // 通过props属性，接收从header组件中传入props属性，size和score，并定义类型type
    // 外部组建传过来的props对象{size:{},score:{}}需要接受
    props: {
      size: {
        type: Number
      },
      score: {
        type: Number
      }
    },
    // 计算属性，
    computed: {
      // 动态绑定style传入方法，添加样式star-x做字符串的拼接，确定传入的size
      starType() {
        return 'star-' + this.size
      },
      // 计算score，
      itemClasses() {
        // 定义变量用来初始化结果和存储最后的计算结果
        let result = [];
        // 非整数分数，向下取0.5的整数
        let score = Math.floor(this.score * 2) / 2;
        // 半数
        let hasDecimal = score % 1 !== 0;
        // 整数，有多少个全星
        let integer = Math.floor(score);
        // 数组的前面放全星
        for (let i = 0; i < integer; i++) {
          result.push(CLS_ON);
        }
        // 判断有没有半星，有的话就放入数组
        if (hasDecimal) {
          result.push(CLS_HALF);
        }
        // 如果长度小于数组的长度，就放入空的星星
        while (result.length < LENGTH) {
          result.push(CLS_OFF);
        }
        return result;
      }
    }
  }
</script>

<style lang="stylus">
  // 引入mixin使用bg-image
  @import "../../common/stylus/mixin.styl"

  .star
    font-size: 0
    .star-item
      display: inline-block
      background-repeat: no-repeat
    &.star-48
      .star-item
        width: 20px
        height: 20px
        margin-right: 22px
        background-size: 20px 20px
        &:last-child
          margin-right: 0
        &.on
          bg-image('star48_on')
        &.half
          bg-image('star48_half')
        &.off
          bg-image('star48_off')
    &.star-36
      .star-item
        width: 15px
        height: 15px
        margin-right: 6px
        background-size: 15px 15px
        &:last-child
          margin-right: 0
        &.on
          font-size: 16px
          bg-image('star36_on')
        &.half
          bg-image('star36_half')
        &.off
          bg-image('star36_off')
    &.star-24
      .star-item
        width: 10px
        height: 10px
        margin-right: 3px
        background-size: 10px 10px
        &:last-child
          margin-right: 0
        &.on
          bg-image('star24_on')
        &.half
          bg-image('star24_half')
        &.off
          bg-image('star24_off')
</style>
