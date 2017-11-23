## vue-resource

安装：

	npm i vue-resource -S

使用：

1. 在main.js中

	`import VueResource from 'vue-resource'`

	`Vue.use(VueResource)`

2. mock数据 ;
	
	`npm run mock`

3. 在App.vue中
		
		  export default {
		    name: 'app',
		    data(){
		      return{
		          seller:this.seller
		      }
		    },
		    created(){
			// this 指向 vue实例
		        this.$http.get('/api/seller').then((response)=>{
		          if(response.status === 200){
		              this.seller = response.body;
		              console.log(this.seller);
		          }
		
		        })
		    },
		    components: {
		      'v-header': header
		    }
		  }


	![](./images/img2.png)


## vue中的img的src属性

得使用v-bind:src="..."

	<img :src="seller.avatar" alt="" width="64" height="64">

## 使用display：inline-block时的问题

问题：当使用`display:inline-block`的时候，如果有两个或者是两个以上的行内块，如果是标签之间有换行或者是空格的时候，行内元素并不会紧贴着

解决：给行内块元素的父元素设置：`font-size:0`


## vue组件设计的原则

就近维护，组件使用的图片都要放到组件下

@2x,@3x图片

定义一个mixin

	bg-image($url)
	  background-image:url($url+"@2x.png")
	  @media (-webkit-min-device-pixel-ratio:3),(min-device-pixel-ratio:3)
	    background-image:url($url+"@3x.png")

引用之后再定义background-size和background-repeat属性

## 动态绑定class

v-bind:class="表达式"

<span class="icon" :class="classMap[seller.supports[0].type]"></span>
	
	export default{
  	  props:{
          seller:{
              type:Object
          }
      },
      created(){
          this.classMap = ['decrease','discount','special','invoice','guarantee']
      }
	}

## 文字太多显示...

给父元素添加属性

	 white-space:nowrap
	 overflow:hidden
	 text-overflow: ellipsis

## css filter滤镜

	filter:blur(10px)

## css sticky footer布局

## 实现star的计算属性

	computed属性

## flex布局实现两边横线中间文字

参考阮一峰的flex文章
	
	  <div class="title">
	    <div class="line"></div>
	    <div class="text"></div>
	    <div class="line"></div>
	  </div>
	  
## vue 动画

 vue1.0与2.0的变化
 
 模态框的模糊背景：backdrop-filter:blur(10px),只在ios上能实现 
