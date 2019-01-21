// components/search-picker/search-picker.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        list:{
            type:Array,
            value:[]
        },//可选列表
        placeholder:{
            type:String,
            value:'请输入内容进行选择'
        },
        key:{
            type:String,
            value:'title'
        },//列表显示的字段名
        show:{
            type:Boolean,
            value:false
        },//是否显示组件
    },

    /**
     * 组件的初始数据
     */
    data: {
        inputVal:'',//输入内容
        // hideList:false,//是否隐藏列表
        // canInput:true,//能否在输入框编辑
    },
    attached: function(){

    },
    /**
     * 组件的方法列表
     */
    methods: {
        getInput: function (e) {
            this.setData({
                inputVal:e.detail.value
            });
            this.triggerEvent('getInput', this.data.inputVal);
        },
        select: function (e) {
            let index = e.currentTarget.dataset.index;
            let key = this.data.key;
            this.setData({
                show:false
            });
            this.triggerEvent('getSelect',index)
        },
        clearSelect: function () {
            this.setData({
                inputVal:'',
            });
            // this.triggerEvent('reset','')
        },
        hidePicker: function () {
            this.setData({
                show:false,
            });
            this.triggerEvent('showFn',false)
        }
    }
});
