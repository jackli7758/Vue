function isValueNumber(value) {
    /*全局函数:判断value是否为纯数字*/
    return (/(^-?[0-9]+\.{1}\d+$)|(^-?[1-9][0-9]*$)|(^-?0{1}$)/).test(value+'');
}
Vue.component('input-number',{
    template:'\
        <div class="input-number">\
            <input \
                type="text"\
                :value="currentValue"\
                @change="handleChange">\
            <button \
                @click="handleDown"\
                :disabled="currentValue<=min">-</button>\
            <button \
            @click="handleUp"\
            :disabled="currentValue>=max">+</button>\
        </div>',
    props:{//props用来设置组件的特性
        max:{
            type:Number,//type为number
            default:Infinity//默认值:正无穷
        },
        min:{
            type:Number,
            default:-Infinity//默认值:负无穷
        },
        value:{
            type:Number,
            default:0//默认值:0
        }
        },
    data:function () {//data用来临时储存需要的数据
        return{
            currentValue:this.value
        }
    },
    watch:{//监听currentValue和value
        currentValue:function (val) {
            this.$emit('input',val);//触发input事件，value作为参数传递
            this.$emit('on-change',val);//触发on-change事件，value作为参数传递
        },
        value:function (val) {//当value值变化时，执行methods中的方法
            this.updateValue(val);//value值作为参数传递到方法中
        }
    },
    methods:{
        updateValue:function (val) {
            if(val>this.max) val=this.max;//对传入的参数进行修改，最大最小值不符合要求则进行覆盖
            if(val<this.min) val=this.min;
            this.currentValue=val;//修改后的value值，再传递给currentValue
        },
        handleDown:function () {
            if(this.currentValue<=this.min) return;
            this.currentValue-=1;
        },
        handleUp:function () {
            if(this.currentValue>=this.max) return;
            this.currentValue+=1;
        },
        handleChange:function (event) {
            var val=event.target.value.trim();//去除value首尾空格
            var max=this.max;
            var min=this.min;
            if(isValueNumber(val)){
                /*如果传入的val为数字*/
                val=Number(val);//把对象转为数字
                this.currentValue=val;//先赋值
                /*过滤覆盖*/
                if(val>max){
                    this.currentValue=max;
                }else if(val<min){
                    this.currentValue=min;
                }

            }else{
                /*如果传入的val不是数字,就重置为之前的currentValue*/
                event.target.value=this.currentValue;
            }
        }
    },
    mounted:function () {//#app挂载完成后执行函数
        this.updateValue(this.value);//对实例传入的value值进行过滤
    }

})