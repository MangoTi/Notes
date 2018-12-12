# 微信小程序重点

## 一、项目构成

1、文件组成：.json/.wxml/.wxss/.js

  app.json：（根目录下）是全局配置，包括小程序的所有页面路径、界面表现、网络超时时间、底部 tab 等；
  project.config.json：（根目录下）工具的个性化配置；
  page.json：（各页面目录下）各页面单独配置；
  
  .wxml文件：类似HTML文件，是页面的结构，但是标签不同，没有div,span等，而是用view,text等取代；
  
  .wxss文件：样式，仅支持部分css选择器，支持rpx尺寸单位，可以配置全局的样式app.wxss;
  
  .js文件：交互逻辑等，例如点击事件等；
  
  
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
    onLaunch:监听小程序初始化，参数可以用wx.getLaunchOptionSync获取，是一个Object；
    onShow:监听小程序显示，启动或者从后台进入前台，对应onHide，从前台进入后台，可以用wx.onAppShow/wx.onAppHide绑定监听；
    onError:监听错误；
    onPageNotFound:监听页面不存在；
    前后台：当用户离开当前小程序或者离开微信，小程序并没有销毁，而是进入后台，
           再次打开时又会从后台进入前台，只有当进入后台一定时间或系统资源占用过高，才会被销毁。
    可以通过全局的getApp()获取到app实例，不要在定义于App()内部的函数中调用，用this就可以拿到app实例。
      

2、场景值
    即当前小程序从哪个场景打开，可以在 App 的 onLaunch 和 onShow，或wx.getLaunchOptionsSync 中获取，其scene属性就是场景值，例如1001就是发现栏小程序入口，1011是扫描二维码
    
3、注册页面
    Page()接受一个Object类型的参数，指定页面的初始数据、生命周期回调（如页面加载onLoad/显示onShow/初次渲染完成onReady/隐藏onHide/卸载onUnload等）、事件处理函数（下拉/转发/上拉等）等，还有任意的函数或数据，用this访问。
    生命周期是onLoad->onShow->onReady,后面若有onHide->onShow，被摧毁后执行onUnload
    注意：
    
      不同于vue的是自定义方法不用放在methods里面了；
      onLoad（Object query）方法中可以获取当前页面路径中的参数，即query；
      onPageScroll方法中避免过于频繁的执行setData引起逻辑层-渲染层通信的操作，会影响通信耗时；
      函数中可以用this.route获取当前路径；
      Page.prototype.setData(Object data, Function callback)，修改的属性并不需要提前在this.data中定义，说明可以用来追加；单次不能超过1024kB
      直接this.data赋值是无法改变状态的；
      
     

4、
    

