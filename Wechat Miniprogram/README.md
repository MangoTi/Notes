# 微信小程序学习笔记

## 一、项目构成

1、文件组成：.json/.wxml/.wxss/.js

  * app.json：（根目录下）是全局配置，包括小程序的所有页面路径、界面表现、网络超时时间、底部 tab 等；
  * project.config.json：（根目录下）工具的个性化配置；
  * page.json：（各页面目录下）各页面单独配置；
  
  * .wxml文件：类似HTML文件，是页面的结构，但是标签不同，没有div,span等，而是用view,text等取代；
  
  * .wxss文件：样式，仅支持部分css选择器，支持rpx尺寸单位，可以配置全局的样式app.wxss;
  
  * .js文件：交互逻辑等，例如点击事件等；
  
  
2、页面生成
  微信客户端先根据.json文件的配置生成一个界面，然后装载.wxml里的结构和.wxcc里的样式，最后装载.js，.js中的内容结构如下
  
    Page({
      data: { // 参与页面渲染的数据
        logs: []
      },
      onLoad() {
        // 页面渲染后 执行
      }
    })
  
  page是页面结构器，在生成页面的时候data数据和.wxml一起渲染出最终结构。
  
3、一些重要的配置

  functionPage:是否启用插件功能，即类似获取用户信息、支付等功能；
  plugins：声明要使用的插件：
    
    {
      "plugins": {
        "myPlugin": {
          "version": "1.0.0",
          "provider": "wxidxxxxxxxxxxxxxxxx"
        }
      }
    }
    
## 二、逻辑层

1、注册程序
  App()函数用来注册一个小程序，必须在app.js中必须且只能调用一次，接受一个Object对象，其参数有：
  
  * onLaunch:监听小程序初始化，参数可以用wx.getLaunchOptionSync获取，是一个Object；
  * onShow:监听小程序显示，启动或者从后台进入前台，对应onHide，从前台进入后台，可以用wx.onAppShow/wx.onAppHide绑定监听；
  * onError:监听错误；
  * onPageNotFound:监听页面不存在；
    
   前后台：当用户离开当前小程序或者离开微信，小程序并没有销毁，而是进入后台，
         再次打开时又会从后台进入前台，只有当进入后台一定时间或系统资源占用过高，才会被销毁。  
   可以通过全局的getApp()获取到app实例，然后才能访问App()中定义的全局属性等，不要在定义于App()内部的函数中调用，用this就可以拿到app实例。
      

2、场景值
    即当前小程序从哪个场景打开，可以在 App 的 onLaunch 和 onShow，或wx.getLaunchOptionsSync 中获取，其scene属性就是场景值，例如1001就是发现栏小程序入口，1011是扫描二维码
    
3、注册页面
    Page()接受一个Object类型的参数，指定页面的初始数据、生命周期回调（如页面加载onLoad/显示onShow/初次渲染完成onReady/隐藏onHide/卸载onUnload等）、事件处理函数（下拉/转发/上拉等）等，还有任意的函数或数据，用this访问。  
    生命周期是onLoad->onShow->onReady,后面若有onHide->onShow，被摧毁后执行onUnload
    
  注意：
    
  * 不同于vue的是自定义方法不用放在methods里面了；
  * onLoad（Object query）方法中可以获取当前页面路径中的参数，即query；
  * onPageScroll方法中避免过于频繁的执行setData引起逻辑层-渲染层通信的操作，会影响通信耗时；
  * 函数中可以用this.route获取当前路径；
  * Page.prototype.setData(Object data, Function callback)，修改的属性并不需要提前在this.data中定义，说明可以用来追加；
  *  setData单次不能超过1024kB;
  * 直接this.data赋值是无法改变状态的；
      
     
4、页面路由

  页面采用栈的形式维护，当路由切换时，栈的表现如下：  
    路由方式	->  页面栈表现
  * 初始化（小程序打开第一个页面）	->  新页面入栈后，页面onLoad然后onShow；
  * 打开新页面（调用wx.navigateTo）	->  新页面入栈，路由前页面onHide，路由后同上，旧页面没有出栈，返回还在；
  * 页面重定向（调用wx.redirectTo）	->  当前页面出栈，新页面入栈，路由前页面onUnload，路由后同上;
  * 页面返回（调用wx.navigateBack）	->  页面不断出栈，直到目标返回页，路由前页面onUnload，路由后页面onShow;
  * Tab 切换（调用wx.switchTab）	->  页面全部出栈，只留下新的 Tab 页面，较为复杂，具体看页面原先的状态；
  * 重加载（调用wx.reLaunch）	->  页面全部出栈，只留下新的页面，路由前页面onUnload，路由后页面onLoad然后onShow；
  
  getCurrentPages()可以获取页面栈实例，是一个数组，第一个元素是首页，最后一个是当前页。不要去修改页面栈，会导致路由及页面状态错误。不要在App.onLaunch的时候调用，因为页面还未生成。
  
  Tips:

  * navigateTo, redirectTo 只能打开非 tabBar 页面，即不在底部菜单栏的页面列表中。
  * switchTab 只能打开 tabBar 页面。
  * reLaunch 可以打开任意页面。
  * 页面底部的 tabBar 由页面决定，即只要是定义为 tabBar 的页面，底部都有 tabBar。
  * 调用页面路由带的参数可以在目标页面的onLoad中获取。
  
5、模块化

  将一些公用的代码放在一个js中，作为一个模块：
  
      // common.js
    function sayHello(name) {
      console.log(`Hello ${name} !`)
    }
    function sayGoodbye(name) {
      console.log(`Goodbye ${name} !`)
    }
    module.exports.sayHello = sayHello//对外暴露接口
    exports.sayGoodbye = sayGoodbye//exports是module.exports的引用，随意改变会造成未知错误还是用上一行的方式较好
 
  在需要使用的页面中
  
    const common = require('common.js')//引入文件，引号中只能是相对路径，暂不支持绝对路径
    Page({
      helloMINA() {
        common.sayHello('MINA')
      },
      goodbyeMINA() {
        common.sayGoodbye('MINA')
      }
    })
    
6、API
  api有以下几种类型：
 
  * 事件监听API，监听某个事件是否触发，要接受一个回调函数作为参数，事件触发的时候调用，并将数据以形参的方式传入，如wx.onCompassChange；
  * 同步API，执行结果可以用try catch获取，如设置某个值时，例如wx.setStorage({key: 'key'})；
  * 异步API，通常接受一个Object类型的参数，该参数可以包含success,fail,complete等字段来接收结果，上述字段的函数调用时会传入一个Object，包含结果。如wx.login({success(res){console.log(res)}});
  
## 视图层

（一）WXML

  数据绑定用{{}}，组件属性/控制属性/关键字都要在双引号内，可以在{{}}内各种运算，也可以将对象组合，若变量名相同，后面的值会覆盖前面的；  
  列表渲染是wx:for，index和item是默认的，或者用wx:for-item/wx:for-index指定变量名，若是列表会发生变化且希望各项保持自己的特征和状态，就要指定wx:key，可以是item的某个属性，直接是个字符串，也可以是保留关键字*+this，代表item本身，但是需要item是一个数字或字符串；  
  条件渲染是wx:if/wx:elif/wx:else，双引号内{{}}放属性名，受同一个属性控制的view可以用block标签包含，block不会在页面中做任何渲染，仅仅是个包含元素，wx:if是惰性的，只有当条件第一次变成真的时候才会局部渲染；  
  模板如下
  
      <!--wxml初始化-->
    <template name="staffName">
      <view> FirstName: {{firstName}}, LastName: {{lastName}} </view>
    </template>
    <!--使用...将一个对象展开-->
    <template is="staffName" data="{{...staffA}}"></template>
    <template is="staffName" data="{{...staffB}}"></template>
    <template is="staffName" data="{{...staffC}}"></template>
    // page.js
    Page({
      data: {
        staffA: {firstName: 'Hulk', lastName: 'Hu'},
        staffB: {firstName: 'Shang', lastName: 'You'},
        staffC: {firstName: 'Gideon', lastName: 'Lin'}
      }
    })
    
  事件分为冒泡和非冒泡，如touchstart/tap等都是冒泡的，而像form的submit,input的input事件都是非冒泡，事件的绑定有bind和catch两种，bind不会阻止冒泡，而catch可以阻止向上冒泡。  
  触摸类事件支持捕获阶段，位于冒泡之前，事件到达节点的顺序与冒泡相反。监听捕获用capture-bind、capture-catch，后者将中断捕获阶段和取消冒泡阶段。
  
（二）WXSS
  独有的尺寸单位rpx，根据屏幕宽度自适应，750rpx;  
  可以在wxss中导入其他样式表用@import "common.wxss";  
  在wxml的内联style中接收动态的样式，在运行时会进行解析，请尽量避免将静态的样式写进 style 中，以免影响渲染速度。
 
（三）基础组件
组件的公共属性data-* (如data-value)可以绑定任意的属性，组件上触发的事件时，会发送给事件处理函数，事件的参数中会有一个dataset，会包含所有的data-* ,例如value:'',组件都不能在绑定时指定参数，因此只能通过这种方式传参。  
hidden可以用该属性控制显示影藏。

（四）WXS
wxs是用来写模块的一种脚本语言，跟js很像，可以构建出页面的结构，可以写在<wxs>标签中，或者.wxs文件中，然后引用<wxs src="./../tools.wxs" module="tools" />，一定要有module，在使用页面调用数据时使用，建议唯一，否则后面的会覆盖前面的。其运行环境和js是隔离的，不能调用js中的函数，也不能调用小程序api。要用module.exports将变量或函数暴露出来，外部才能根据模块名打点调用，以下是示例。

    <!--wxml-->
    <wxs module="m1">var msg = "hello world"; module.exports.message = msg;</wxs>//module后面是模块名称
    <view>{{m1.message}}</view>
    
    <!--wxml-->
    <!-- 下面的 getMax 函数，接受一个数组，且返回数组中最大的元素的值 -->
    <wxs module="m1">
      var getMax = function(array) { var max = undefined; for (var i = 0; i <
      array.length; ++i) { max = max === undefined ? array[i] : (max >= array[i] ?
      max : array[i]); } return max; } module.exports.getMax = getMax;
    </wxs>

    <!-- 调用 wxs 里面的 getMax 函数，参数为 page.js 里面的 array -->
    <view>{{m1.getMax(array)}}</view>

在.wxs模块中引用其他 wxs 文件模块，可以使用 require 函数，但是只能使用相对路径，并且每个模块只有一个实例，多处引用的都是同一个，如果定义之后没被引用就不会解析。
（三）自定义组件  
1、也是有自己的四件套文件的，在微信开发工具里可以一键创建一套，然后wxml文件中就是标签结构，js文件不同于其余页面，结构如下：

    // pages/my/dateareaPicker.js
    Component({
        /**
         * 组件的属性列表
         */
        properties: {
            showDatePicker:{
                type:Boolean,//类型
                value:false//默认值
            }
        },

        /**
         * 组件的初始数据
         */
        data: {
            begin:'',//行为统计时间段开始时间
            end:'',//行为统计时间段结束时间
            today:'',//今天日期
        },

        /**
         * 组件的方法列表
         */
        lifetimes: {//组件的生命周期
             attached() {
               // 在组件实例进入页面节点树时执行
             },
             detached() {
               // 在组件实例被从页面节点树移除时执行
             },
        },
        methods: {
        }
    })
 使用时，要在使用页面的json文件中声明：
 
    {
      "usingComponents": {
        "my-component": "/components/component-tag-name"
      }
    }
 在页面中就可以直接用<my-component></my-component>，标签内部可以放slot内容

    <view>
      <component-tag-name prop-a="{{dataFieldA}}" prop-b="{{dataFieldB}}">
        <!-- 这部分内容将被放置在组件 <slot> 的位置上 -->
        <view>这里是插入到组件slot中的内容</view>
      </component-tag-name>
    </view>
prop-a是属性名
2、组件的生命周期  
![生命周期函数](https://github.com/MangoTi/Notes/blob/master/1c0156d3b8344f57d3ff1a16a117610.png)
生命周期可以像上面一样写在lifetimes里，也可以直接写在外面，跟mehtods同级。  
除此之外，还有组件所在页面的生命周期，它们并非与组件有很强的关联，但有时组件需要获知，以便组件内部处理。在 pageLifetimes 定义段中定义。其中可用的生命周期包括：show(组件所在页面显示时执行)，hide(隐藏时)，resize(组件所在页面尺寸发生变化，参数是size)。

3、组件的behaviors
用于组件间代码共享的特性，即若干个组件都有相同的生命周期、数据、属性、方法等，可以使用该属性。  

     // my-behavior.js
     module.exports = Behavior({//使用该构造器定义
       behaviors: [],//可以引用其他的behaviors
       properties: {
         myBehaviorProperty: {
           type: String
         }
       },
       data: {
         myBehaviorData: {}
       },
       attached() {},
       methods: {
         myBehaviorMethod() {}
       }
     })

引用如下：

     // my-component.js
     const myBehavior = require('my-behavior')
     Component({
       behaviors: [myBehavior],
       properties: {
         myProperty: {
           type: String
         }
       },
       data: {
         myData: {}
       },
       attached() {},
       methods: {
         myMethod() {}
       }
     })
引用时它的属性、数据和方法会被合并到组件中，生命周期函数也会在对应时机被调用，例如当触发attached方法时会一次触发myBehavior和my-component中的attached方法。  
注意：
    * 如果出现同名，组件本身的属性或方法会覆盖 behavior 中的属性或方法，如果引用了多个 behavior ，在定义段中靠后 behavior 中的属性或方法会覆盖靠前的属性或方法；
    * 如果有同名的数据字段，如果数据是对象类型，会进行对象合并，如果是非对象类型则会进行相互覆盖；
    * 生命周期函数不会相互覆盖，而是在对应触发时机被逐个调用。如果同一个 behavior 被一个组件多次引用，它定义的生命周期函数只会被执行一次。
    
4、父子组件间传值
父组件传给子组件就像上文实例中使用properties属性，在组建中采用驼峰，在组件标签中改成小写用-连接，如showDate -> show-date；  
子组件传给父组件采用方法triggerEvent触发父级的事件，
父组件：

    //wxml,监听getData事件的触发
    <right-filter filter-list="{{filterList}}" show-select="{{showSelect}}" bindgetData="getResult"></right-filter>
    //js
    getResult: function (data) {
        //data是点击对象，detail才是数据,这是很奇怪的一点
    }
    //json
    "usingComponents": {
      "right-filter": "/components/right-filter/right-filter"
    }

子组件：
    
    //wxml与非组件页面相同，展示组件的结构
    //js
    
    /**
     * 组件的属性列表，默认筛选年月
     */
    properties: {
        //筛选项列表
        filterList: {
            type: Array,
            value: [
                {
                    name: '年份',//显示文字
                    key: 'year',//键值
                    data: [],//可选范围
                    show: true,//是否显示
                    value: ''//选中值
                }
            ]
        },
        showSelect: {
            type: Boolean,
            value: false
        }
    },
    /**
     * 组件的初始数据
     */
    data: {},
    // 在组件实例进入页面节点树时执行
    attached: function () {
    },
    methods:{
    //提交筛选值
        submit: function (e) {
            this.slideSelect();
            let data = {};
            //将结果拼成一个对象
            this.data.filterList.forEach(function (item) {
                let key = item.key;
                data[key] = item.value;
            });
            this.triggerEvent('getData', data);//触发父级的事件getData，data为参数
        },
     }
其中有一点比较奇怪的是，子组件传递的参数在父级获取时会被点击对象包裹，应该是子组件触发submit事件的点击对象，应该是包装起来一起传以备不时之需。
