## food商品详情

### 父组件中通过定义ref属性来获取到子组件中的方法属性show（）

food组件：

	  // 方法属性，父组件可以调用子组件的方法，goods组件中的ref=food
	    methods:{
	      show(){
	        this.showFlag = true;
	      },
	    }
	    
goods组件

	   <!--商品详情-->
    	<Food :food="selectedFood" ref="food"></Food>
    	
    	methods:{
	       // 点击商品显示商品详情,通过点击事件，给selectedFood传入当前选中的li的详情food
	      selectFood(food, event) {
	        if (!event._constructed) {
	          return;
	        }
	        this.selectedFood = food;
	        // 通过在子组件food中定义一个方法属性show方法来显示food，使用ref属性来拿到子组件
	        this.$refs.food.show();
	      },
	    }
 
 
###  margin/padding的百分比值实现高度自适应（多用于占位，避免闪烁）

padding百分比的值跟父元素的宽度值是一样的

    .image-header
        position:relative
        width :100%
        height :0
        padding-top:100%
        img
          position :absolute
          top: 0
          left: 0
          width :100%
          height :100%