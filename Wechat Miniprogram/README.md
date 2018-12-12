# 微信小程序重点

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

1、WXML

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
    
  事件分为冒泡和非冒泡，如touchstart/tap等都是冒泡的，而像form的submit,input的input事件都是非冒泡，事件的绑定有bind和catch两种，bind不会阻止冒泡，而catch可以阻止向上冒泡
