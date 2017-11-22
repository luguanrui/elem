<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item,index) in goods" :key="index" class="menu-item" :class="{current:currentIndex==index}"
            @click="selectMenu(index,$event)">
          <span class="text border-1px">
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="(item,index) in goods" :key="index" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="(food,index) in item.foods" :key="index" class="food-item border-1px">
              <div class="icon">
                <img :src="food.icon" alt="" width="57" height="57">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="description">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span>
                  <span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="nowPrice">￥{{food.price}}</span>
                  <span v-show="food.oldPrice" class="oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrl-wrapper">
                  <CartContrl :food="food"></CartContrl>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <ShopCart :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></ShopCart>
  </div>
</template>

<script type="text/ecmascript-6">

  // 引入滚动插件
  import Bscroll from 'better-scroll';
  // 引入购物车组件,并在components注册组件
  import ShopCart from '../shopcart/shopcart.vue'
  //引入则增加减少按钮组件，并在components注册组件
  import CartContrl from '../cartcontrl/cartcontrl.vue'

  export default {

    // props传递父组件的值
    props: {
      seller: {
        type: Object
      }
    },

    // 初始化数据
    data(){
      return {
        goods: [],
        listHeight: [],
        scrollY: 0
      }
    },

    // 组件
    components: {
      ShopCart,
      CartContrl
    },

    // 计算属性
    computed: {
      // 获取当前foodsList的index
      currentIndex(){
        for (let i = 0; i < this.listHeight.length; i++) {
          // 获得当前 height的高度
          let height1 = this.listHeight[i];
          // 获得下一个高度
          let height2 = this.listHeight[i + 1];
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i;
          }

        }
        return 0;
      },
      // 向下传递数据：商品的数量
      selectFoods(){
        let foods = [];
        this.goods.forEach((good)=>{
            good.foods.forEach((food)=>{
              if (food.count){
                foods.push(food)
              }
            })
        });
        return foods;
      }
    },

    // 生命周期钩子函数
    created(){
      // 请求数据
      this.$http.get('/api/goods').then(response => {
        if (response.status === 200) {
          // 获取数据
          this.goods = response.body;
          // 操作DOM
          this.$nextTick(() => {
            // 首先初始化实现滚动
            this._initScroll();
            // 计算高度
            this._calculateHeight();
          })
          //  console.log(this.goods)
        }
      });
      // 左侧menu的item的icon
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    },

    // 方法属性
    methods: {
      // 初始化scroll
      _initScroll(){
        // 实例化menuScroll
        this.menuScroll = new Bscroll(this.$refs.menuWrapper, {
          click: true //默认是阻止了单击事件
        });
        // 实例化foodsScroll
        this.foodsScroll = new Bscroll(this.$refs.foodsWrapper, {
          probeType: 3,// foods滚动的时候的位置
          click: true //默认是阻止了单击事件,可以使用添加商品按钮
        });
        // 添加滚动监听事件
        this.foodsScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y));
//               console.log("scrollY:"+this.scrollY)
        })
      },

      // 计算区间的高度
      _calculateHeight(){
        // 获取每个food是的li
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      },

      // 左侧menu点击事件,传入event是为了去除浏览器端点击一次触发两次点击事件
      selectMenu(index, event){
        if (!event._constructed) {
          return;
        }
        // 获取每个food是的li
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        // 获取当前点击menu的DOM元素
        let el = foodList[index];
        // 使用better-scroll的scrollToElement()[有动画效果]方法实现滚动到相应的foodlist
        this.foodsScroll.scrollToElement(el, 300)
      }
    }
  };
</script>

<style lang="stylus">

  @import "../../common/stylus/mixin.styl"

  .goods
    display: flex
    position: absolute
    top: 174px
    bottom: 46px
    width: 100%
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        padding: 0 12px
        line-height: 14px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          font-weight: 700
          .text
            border-none()

        .text
          display: table-cell
          vertical-align: middle
          font-size: 12px
          border-1px(rgba(7, 17, 27, 0.1))
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
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
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:lat-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            height: 14px
            line-height: 14px
            margin: 2px 0 8px 0
            color: rgb(7, 17, 27)
            font-size: 14px
          .description, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .description
            margin-bottom: 8px
            line-height: 14px
          .extra
            .count
              margin-right: 12px
          .price
            .nowPrice, .oldPrice
              font-weight: 700
              line-height: 24px
            .nowPrice
              margin-right: 8px;
              font-size: 14px
              color: rgb(240, 20, 20)
            .oldPrice
              text-decoration: line-through
              color: rgb(147, 153, 159)
              font-size: 10px
          .cartcontrl-wrapper
            position: absolute
            right: 0
            bottom: 12px


</style>
