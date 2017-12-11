Vue.component('tabs',{
    template:`\
    <div class="tabs">\
        <div class="tabs-bar">\
            <div\
                :class="tabCls(item)"\
                v-for="(item,index) in navList"\
                @click="handleChange(index)">\
                {{item.label}}\
            </div>\
        </div>\
        <div class="tabs-content">\
            <slot></slot>\
        </div>\
    </div>`,
    props:{
        value:{
            type:[String,Number]//验证value类型为字符or数字
        }
    },
    data:function () {
        return{
            currentValue:this.value,
            navList:[] //navList 数组内 是 (对象),每个对象代表一个选项卡标题
            /*格式:{
                    label:xxx, //代表选项卡标题
                    name:xxx   //代表用户自己设置的选项卡名称，可以不设置，默认值为index
                   }*/
        }
    },
    methods:{
        /*获取所有pane组件实例*/
        getTabs(){
            return this.$children.filter(function (item) {//filter()返回的是过滤后的新数组
                return item.$options.name==='pane';
            });
        },
        /*获取子组件的tabs标题*/
        updateNav(){
            this.navList=[];//初始化，数组中保存对象
            let _this=this;//此方法会被子组件pane调用,储存_this，使其永远指向tabs
            this.getTabs().forEach(function (pane,index) {
                //遍历所有的pane实例，利用对象提取数据，再放入navList数组中
                _this.navList.push({
                    label:pane.label,
                    name:pane.name || index
                });
                if(!pane.name) pane.name=index;//如果pane实例的name未设置，则使用index作为name
                /*初始化选中第一个选项卡*/
                if(index===0){
                    if(!_this.currentValue){//初始化中，currentValue还未设置
                        _this.currentValue=pane.name || index;
                    }
                }
            });
            this.updateStatus();//更新状态
        },
        /*控制pane的隐藏与显示*/
        updateStatus(){
            let tabs=this.getTabs();//tabs为所有pane组件实例
            tabs.forEach((tab) => tab.show=tab.name===this.currentValue);
            //遍历所有pane
            //判断currentValue(处于tabs组件中)是否等于tab.name(pane组件实例的name)?
            // 相等（true）:不等(false)
        },
        /*控制tabs的cls*/
        tabCls:function (item) {
            return[
                'tabs-tab',//固定返回cls
                {
                    'tabs-tab-active':item.name===this.currentValue//根据条件返回cls
                }
            ]
        },
        /*点击标题时更新value/改变tab*/
        handleChange:function (index) {
            let nav=this.navList[index];//提取标题的name,赋予currentValue
            let name=nav.name;
            this.currentValue=name;//1:触发watch监听事件.2:改变当前选中的tab
            this.$emit('input',name);
            //!!!子组件向父组件传递value值，需要用到自定义事件
            //!!!点击标题，触发input事件，将name作为父件的value传入props中
            this.$emit('on-click',name);
        }

    },
    watch: {
        value: function (val) {
            this.currentValue = val;//监听子组件是否有给父组件发送value值，点击tabs时就会触发此事件
        },
        currentValue: function () {
            this.updateStatus();//选中哪个标题，currentValue的值就为那个标题的name
                                //currentValue变化时，更新pane的显示与隐藏
        }
    }
});