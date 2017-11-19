<template>
  <div class="goods">
    <div class="menu-wrapper">
      <ul>
        <li v-for="(item,index) in goods" class="menu-item">
          <span class="text">
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props:{
      seller:{
        type:Object
      }
    },
    data(){
      return{
        goods:[]
      }
    },
    created(){
      // 请求数据
      this.$http.get('/api/goods').then(response=>{
        if(response.status === 200){
          this.goods = response.body;
//          console.log(this.goods)
        }
      });
      // 右侧menu的item的icon
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']

    }
  };
</script>

<style lang="stylus">
  @import "../../common/stylus/mixin.styl"
  .goods
    dispaly: flex
    position: absolute
    top: 174px
    bottom: 46px
    width: 100%
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background:#f3f5f7
      .menu-item
        display:table
        height: 54px
        width: 56px
        line-height: 14px
        .icon
           display: inline-block
           vertical-align: top
           width: 12px
           height: 12px
           margin-right: 4px
           background-size: 12px 12px
           background-repeat: no-repeat
           &.decrease
             bg-image('decrease_3')
           &.discount
             bg-image('discount_3')
           &.guarantee
             bg-image('guarantee_3')
           &.invoice
             bg-image('invoice_3')
           &.special
               bg-image('special_3')
    .foods-wrapper
      flex:1
</style>
