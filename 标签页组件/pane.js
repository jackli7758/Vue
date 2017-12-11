Vue.component('pane',{
    name:'pane',
    template:'\
        <div class="pane" v-show="show">\
            <slot></slot>\
        </div>',
    data:function () {
        return{
            show:true
        }
    },
    props:{
        name:{
            type:String
        },
        label:{
            type:String,
            default:''
        }
    },
    methods:{
        updateNav(){
            this.$parent.updateNav();//调用父件的方法
        }
    },
    watch:{
        label(){
            this.updateNav();//监听选项卡标题label是否发生变化
        }
    },
    mounted:function(){
        this.updateNav();  //组件挂载完毕，自动更新标题
    }
});